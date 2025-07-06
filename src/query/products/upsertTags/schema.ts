import { z } from "zod";

export const upsertTagsSchema = z.object({
  tags: z.array(z.string()),
});

export type UpsertTagsSchema = z.infer<typeof upsertTagsSchema>;
