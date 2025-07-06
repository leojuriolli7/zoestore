import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function listTags(): Promise<Products.ListTags> {
  try {
    const tags = await db.query.tags.findMany();

    return {
      tags,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
