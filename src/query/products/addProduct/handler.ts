import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import { products } from "@/query/db/schema";
import { eq } from "drizzle-orm";

export async function addProduct(
  params: AddProductSchema
): Promise<Products.AddProduct> {
  try {
    const [result] = await db
      .insert(products)
      .values({
        name: params.name,
        price: params.price,
        image_url: params.imageUrl,
        description: params.description ?? null,
      })
      .returning();

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
