import "server-only";

import { db } from "@/query/db";
import type { Products } from "../types";
import { NotFoundError } from "@/query/errors/NotFoundError";
import { asc } from "drizzle-orm";
import { productMedias } from "@/query/db/schema";

/** Server-side fetch function. To be used inside Route Handler. */
export async function getProductBySlug(
  slug: string
): Promise<Products.GetProductBySlug> {
  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
    with: {
      medias: {
        orderBy: [asc(productMedias.sortOrder)],
      },
      productTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  if (!product) throw new NotFoundError();

  return {
    ...product,
    tags: product.productTags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
    })),
  };
}
