import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import { products } from "@/query/db/schema";

export async function addProduct(
  params: AddProductSchema
): Promise<Products.AddProduct> {
  try {
    const [product] = await db
      .insert(products)
      .values({
        name: params.name,
        price: params.price,
        image_url: params.imageUrl,
        description: params.description ?? null,
      })
      .returning();

    return { success: true, product };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
