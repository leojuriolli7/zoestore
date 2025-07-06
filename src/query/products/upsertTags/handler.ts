import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { UpsertTagsSchema } from "./schema";
import type { Products } from "../types";
import { productTags, tags as tagsSchema } from "@/query/db/schema";
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

    const tagsToDelete = await db.query.tags.findMany({
      where: notInArray(tagsSchema.name, tags),
    });

    if (tagsToDelete.length > 0) {
      const tagIdsToDelete = tagsToDelete.map((t) => t.id);

      await db
        .delete(productTags)
        .where(inArray(productTags.tagId, tagIdsToDelete));

      await db.delete(tagsSchema).where(inArray(tagsSchema.id, tagIdsToDelete));
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
