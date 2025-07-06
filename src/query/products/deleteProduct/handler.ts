import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";
import { products } from "@/query/db/schema";
import { inArray } from "drizzle-orm";
import { DeleteProductsSchema } from "./schema";

export async function deleteProduct({
  ids,
}: DeleteProductsSchema): Promise<Products.DeleteProduct> {
  try {
    const deleted = await db.transaction(async (tx) => {
      return await tx
        .delete(products)
        .where(inArray(products.id, ids))
        .returning();
    });

    if (!deleted || deleted.length === 0) throw new InternalServerError();

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
