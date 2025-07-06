import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { UpsertTagsSchema } from "./schema";
import type { Products } from "../types";
import { tags as tagsSchema } from "@/query/db/schema";
import { inArray, notInArray } from "drizzle-orm";

export async function upsertTags(
  params: UpsertTagsSchema
): Promise<Products.UpsertTags> {
  try {
    const { tags } = params;

    if (tags.length > 0) {
      const existingTags = await db.query.tags.findMany({
        where: inArray(tagsSchema.name, tags),
      });

      const existingTagNames = existingTags.map((t) => t.name);
      const newTags = tags
        .filter((t) => !existingTagNames.includes(t))
        .map((name) => ({ name }));

      if (newTags.length > 0) {
        await db.insert(tagsSchema).values(newTags);
      }
    }

    await db.delete(tagsSchema).where(notInArray(tagsSchema.name, tags));

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
