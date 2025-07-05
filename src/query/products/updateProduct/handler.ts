import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { UpdateProductSchema } from "./schema";
import type { Products } from "../types";
import { products } from "@/query/db/schema";
import { eq } from "drizzle-orm";

export async function updateProduct(
  id: number,
  params: UpdateProductSchema
): Promise<Products.UpdateProduct> {
  try {
    await db
      .update(products)
      .set({
        ...(params.name !== undefined && { name: params.name }),
        ...(params.price !== undefined && { price: params.price }),
        ...(params.imageUrl !== undefined && { image_url: params.imageUrl }),
        ...(params.description !== undefined && {
          description: params.description,
        }),
      })
      .where(eq(products.id, id));

    const productWithTags = await db.query.products.findFirst({
      where: eq(products.id, id),
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
