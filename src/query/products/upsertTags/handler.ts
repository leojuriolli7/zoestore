import "server-only";
import { db } from "@/query/db";
import type { UpsertTagsSchema } from "./schema";
import type { Products } from "../types";
import { productTags, tags as tagsSchema, products } from "@/query/db/schema";
import { inArray, notInArray } from "drizzle-orm";

export async function upsertTags(
  params: UpsertTagsSchema
): Promise<Products.UpsertTags> {
  return await db.transaction(async (tx) => {
    const { tags } = params;

    if (tags.length > 0) {
      const existingTags = await tx.query.tags.findMany({
        where: inArray(tagsSchema.name, tags),
      });

      const existingTagNames = existingTags.map((t) => t.name);

      const newTags = tags
        .filter((t) => !existingTagNames.includes(t))
        .map((name) => ({ name }));

      if (newTags.length > 0) {
        await tx.insert(tagsSchema).values(newTags);
      }
    }

    const tagsToDelete = await tx.query.tags.findMany({
      where: notInArray(tagsSchema.name, tags),
    });

    if (tagsToDelete.length > 0) {
      const tagIdsToDelete = tagsToDelete.map((t) => t.id);

      const affectedProductsSlugs = await tx
        .select({ slug: products.slug })
        .from(productTags)
        .leftJoin(products, inArray(productTags.tagId, tagIdsToDelete))
        .where(inArray(productTags.tagId, tagIdsToDelete));

      await tx
        .delete(productTags)
        .where(inArray(productTags.tagId, tagIdsToDelete));

      await tx.delete(tagsSchema).where(inArray(tagsSchema.id, tagIdsToDelete));

      return {
        success: true,
        deletedTags: tagsToDelete.map((t) => ({ id: t.id })),
        /**
         * Front can use this to invalidate the cache for the
         * product paths that were affected.
         */
        affectedProducts: affectedProductsSlugs
          .filter((p) => p.slug !== null)
          .map((p) => ({ slug: p.slug! })),
      };
    }

    return { success: true, affectedProducts: [], deletedTags: [] };
  });
}
