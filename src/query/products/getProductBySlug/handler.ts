import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";
import { NotFoundError } from "@/query/errors/NotFoundError";

/** Server-side fetch function. To be used inside Route Handler. */
export async function getProductBySlug(
  slug: string
): Promise<Products.Product | null> {
  try {
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.slug, slug),
      with: {
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
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
