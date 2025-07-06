import { z } from "zod";

export const deleteProductsSchema = z.object({
  ids: z.array(z.number()),
});

export type DeleteProductsSchema = z.infer<typeof deleteProductsSchema>;
