import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";
import { productTags, products } from "@/query/db/schema";
import { inArray } from "drizzle-orm";
import { DeleteProductsSchema } from "./schema";

export async function deleteProduct({
  ids,
}: DeleteProductsSchema): Promise<Products.DeleteProduct> {
  const deleted = await db.transaction(async (tx) => {
    await tx.delete(productTags).where(inArray(productTags.productId, ids));

    return await tx
      .delete(products)
      .where(inArray(products.id, ids))
      .returning();
  });

  if (!deleted || deleted.length === 0)
    throw new InternalServerError("No deleted products found");

  return { success: true };
}
