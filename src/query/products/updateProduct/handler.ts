import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { UpdateProductSchema } from "./schema";
import type { Products } from "../types";
import { products, productTags, tags as tagsSchema } from "@/query/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateSlug } from "@/query/core/generateSlug";

export async function updateProduct(
  slug: string,
  params: UpdateProductSchema
): Promise<Products.UpdateProduct> {
  try {
    const currentProduct = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!currentProduct) throw new InternalServerError();

    await db
      .update(products)
      .set({
        ...(params.name !== undefined && { name: params.name }),
        ...(params.price !== undefined && { price: params.price }),
        ...(params.imageUrl !== undefined && { image_url: params.imageUrl }),
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

    if (params.tags) {
      await db
        .delete(productTags)
        .where(eq(productTags.productId, currentProduct.id));

      if (params.tags.length > 0) {
        const tagsResult = await db.query.tags.findMany({
          where: inArray(tagsSchema.name, params.tags),
        });

        await db.insert(productTags).values(
          tagsResult.map((tag) => ({
            productId: currentProduct.id,
            tagId: tag.id,
          }))
        );
      }
    }

    const productWithTags = await db.query.products.findFirst({
      where: eq(products.id, currentProduct.id),
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
