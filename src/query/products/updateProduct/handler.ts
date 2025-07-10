import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { UpdateProductSchema } from "./schema";
import type { Products } from "../types";
import {
  productMedias,
  products,
  productTags,
  tags as tagsSchema,
} from "@/query/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { generateSlug } from "@/query/core/generateSlug";

export async function updateProduct(
  slug: string,
  params: UpdateProductSchema
): Promise<Products.UpdateProduct> {
  return await db.transaction(async (tx) => {
    const currentProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!currentProduct)
      throw new InternalServerError("currentProduct not found");

    await tx
      .update(products)
      .set({
        updatedAt: new Date(),
        ...(params.name !== undefined && { name: params.name }),
        ...(params.price !== undefined && { price: params.price }),
        ...(params.description !== undefined && {
          description: params.description,
        }),
        ...(params.name !== undefined &&
          params.name !== currentProduct.name && {
            slug: generateSlug(params.name),
          }),
      })
      .where(eq(products.id, currentProduct.id))
      .returning();

    if (params.medias) {
      await tx
        .delete(productMedias)
        .where(eq(productMedias.productId, currentProduct.id));

      if (params.medias.length > 0) {
        await tx.insert(productMedias).values(
          params.medias.map((url, index) => ({
            productId: currentProduct.id,
            url,
            sortOrder: index,
            isPrimary: index === 0,
          }))
        );
      }
    }

    if (params.tags) {
      await tx
        .delete(productTags)
        .where(eq(productTags.productId, currentProduct.id));

      if (params.tags.length > 0) {
        const tagsResult = await tx.query.tags.findMany({
          where: inArray(tagsSchema.name, params.tags),
        });

        await tx.insert(productTags).values(
          tagsResult.map((tag) => ({
            productId: currentProduct.id,
            tagId: tag.id,
          }))
        );
      }
    }

    const productWithTags = await tx.query.products.findFirst({
      where: eq(products.id, currentProduct.id),
      with: {
        medias: {
          orderBy: [asc(productMedias.sortOrder)],
        },
        productTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!productWithTags)
      throw new InternalServerError("productWithTags not found");

    const toProductsDTO = {
      ...productWithTags,
      tags: productWithTags.productTags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
      })),
    };

    return { success: true, product: toProductsDTO };
  });
}
