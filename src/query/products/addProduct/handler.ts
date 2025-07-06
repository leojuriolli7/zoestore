import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import { generateSlug } from "@/query/core/generateSlug";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import { products, productTags, tags as tagsSchema } from "@/query/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function addProduct(
  params: AddProductSchema
): Promise<Products.AddProduct> {
  try {
    const [result] = await db
      .insert(products)
      .values({
        slug: generateSlug(params.name),
        name: params.name,
        price: params.price,
        image_url: params.imageUrl,
        description: params.description ?? null,
      })
      .returning();

    if (params.tags && params.tags.length > 0) {
      const tagsResult = await db.query.tags.findMany({
        where: inArray(tagsSchema.name, params.tags),
      });

      await db.insert(productTags).values(
        tagsResult.map((tag) => ({
          productId: result.id,
          tagId: tag.id,
        }))
      );
    }

    const productWithTags = await db.query.products.findFirst({
      where: eq(products.id, result.id),
      with: {
        productTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!productWithTags) throw new InternalServerError();

    const toProductsDTO = {
      ...productWithTags,
      tags: productWithTags.productTags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
      })),
    };

    return { success: true, product: toProductsDTO };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
