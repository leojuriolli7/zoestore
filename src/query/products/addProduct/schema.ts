import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string(),
  price: z.string(),
  medias: z.array(z.string()),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
