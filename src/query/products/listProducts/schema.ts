import z from "zod";

export const listProductsSchema = z.object({
  cursor: z.coerce.number().nullable(),
  limit: z.coerce.number().nullable(),
  search: z.string().nullable(),
});

export type ListProductsSchema = z.infer<typeof listProductsSchema>;
