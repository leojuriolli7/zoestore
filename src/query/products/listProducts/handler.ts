import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { ListProductsSchema } from "./schema";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function listProducts(
  params: ListProductsSchema
): Promise<Products.ListProducts> {
  try {
    const { cursor = 1, limit = 10 } = params;

    const result = await db.query.products.findMany({
      where: (product, { gt }) => (cursor ? gt(product.id, cursor) : undefined),
      orderBy: (product, { asc }) => asc(product.id),
      limit: limit || 10,
    });

    const nextCursor =
      result.length === limit ? result[result.length - 1].id : null;

    return {
      results: result,
      nextCursor,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
