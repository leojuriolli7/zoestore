import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import { products } from "@/query/db/schema";
import { inArray } from "drizzle-orm";
import type { CheckCartIntegritySchema } from "./schema";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function checkCartIntegrity(
  params: CheckCartIntegritySchema
): Promise<Products.CardIntegrityStatus> {
  try {
    const { productSlugs } = params;

    const existingProducts = await db
      .select({ slug: products.slug })
      .from(products)
      .where(inArray(products.slug, productSlugs));

    const existingIds = existingProducts.map((product) => product.slug);

    const valid = existingIds;
    const invalid = productSlugs.filter((id) => !existingIds.includes(id));

    return {
      valid,
      invalid,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
