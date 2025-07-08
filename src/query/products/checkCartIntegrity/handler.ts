import "server-only";

import { db } from "@/query/db";
import { products } from "@/query/db/schema";
import { inArray } from "drizzle-orm";
import type { CheckCartIntegritySchema } from "./schema";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function checkCartIntegrity(
  params: CheckCartIntegritySchema
): Promise<Products.CardIntegrityStatus> {
  const { productSlugs } = params;

  const existingProducts = await db
    .select({ slug: products.slug })
    .from(products)
    .where(inArray(products.slug, productSlugs));

  const existingSlugs = existingProducts.map((product) => product.slug);

  const valid = existingSlugs;
  const invalid = productSlugs.filter((id) => !existingSlugs.includes(id));

  return {
    valid,
    invalid,
  };
}
