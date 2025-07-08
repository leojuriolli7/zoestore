import "server-only";

import { db } from "@/query/db";
import type { ListProductsSchema } from "./schema";
import type { Products } from "../types";
import { productTags, tags as tagsSchema } from "@/query/db/schema";
import { eq } from "drizzle-orm";

/** Server-side fetch function. To be used inside Route Handler. */
export async function listProducts(
  params: ListProductsSchema
): Promise<Products.ListProducts> {
  const { cursor = 1, limit: _limit, search, tags } = params;

  const limit = _limit || 10;

  const result = await db.query.products.findMany({
    where: (product, { gt, and, ilike, inArray }) => {
      const conditions = [];

      if (cursor) conditions.push(gt(product.id, cursor));

      if (search) conditions.push(ilike(product.name, `%${search}%`));

      if (tags && tags.length > 0) {
        const subquery = db
          .select({ productId: productTags.productId })
          .from(productTags)
          .innerJoin(tagsSchema, eq(productTags.tagId, tagsSchema.id))
          .where(inArray(tagsSchema.name, tags));
        conditions.push(inArray(product.id, subquery));
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    orderBy: (product, { asc }) => asc(product.id),
    limit: limit,
    with: {
      productTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  const toProductsDTO = result.map((product) => ({
    ...product,
    tags: product.productTags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
    })),
  }));

  const nextCursor =
    result.length === limit ? result[result.length - 1].id : null;

  return {
    results: toProductsDTO,
    nextCursor,
  };
}
