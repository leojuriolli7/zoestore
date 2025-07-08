import "server-only";

import { db } from "@/query/db";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function listTags(): Promise<Products.ListTags> {
  const tags = await db.query.tags.findMany();

  return {
    tags,
  };
}
