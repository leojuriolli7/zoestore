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
    const { productIds } = params;

    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds));

    const existingIds = existingProducts.map((product) => product.id);

    const valid = existingIds;
    const invalid = productIds.filter((id) => !existingIds.includes(id));

    return {
      valid,
      invalid,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
