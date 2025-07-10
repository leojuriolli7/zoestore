import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string(),
  price: z.string(),
  medias: z.array(z.string()),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
