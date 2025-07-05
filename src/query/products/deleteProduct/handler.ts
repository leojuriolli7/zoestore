import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";
import { products } from "@/query/db/schema";
import { eq } from "drizzle-orm";

export async function deleteProduct(
  id: number
): Promise<Products.DeleteProduct> {
  try {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deleted) throw new InternalServerError();

    // Fetch tags for the deleted product (if any)
    const tags = await db.query.productTags.findMany({
      where: (pt) => eq(pt.productId, id),
      with: { tag: true },
    });

    const product = {
      ...deleted,
      tags: tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name })),
    };

    return { success: true, product };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
