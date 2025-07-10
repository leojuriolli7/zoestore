import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import { generateSlug } from "@/query/core/generateSlug";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import {
  products,
  productTags,
  tags as tagsSchema,
  productMedias,
} from "@/query/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function addProduct(
  params: AddProductSchema
): Promise<Products.AddProduct> {
  return await db.transaction(async (tx) => {
    const [result] = await tx
      .insert(products)
      .values({
        slug: generateSlug(params.name),
        name: params.name,
        price: params.price,
        description: params.description ?? null,
      })
      .returning();

    if (!result) {
      throw new InternalServerError("Failed to create product");
    }

    const productId = result.id;

    if (params.medias && params.medias.length > 0) {
      await tx.insert(productMedias).values(
        params.medias.map((url, index) => ({
          productId,
          url,
          sortOrder: index,
          isPrimary: index === 0,
        }))
      );
    }

    if (params.tags && params.tags.length > 0) {
      const tagsResult = await tx.query.tags.findMany({
        where: inArray(tagsSchema.name, params.tags),
      });

      await tx.insert(productTags).values(
        tagsResult.map((tag) => ({
          productId: result.id,
          tagId: tag.id,
        }))
      );
    }

    const productWithDetails = await tx.query.products.findFirst({
      where: eq(products.id, result.id),
      with: {
        productTags: {
          with: {
            tag: true,
          },
        },
        medias: true,
      },
    });

    if (!productWithDetails)
      throw new InternalServerError("productWithDetails not found");

    const toProductsDTO = {
      ...productWithDetails,
      tags: productWithDetails.productTags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
      })),
    };

    return { success: true, product: toProductsDTO };
  });
}
