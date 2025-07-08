import z from "zod";

export const checkCartIntegritySchema = z.object({
  productSlugs: z.array(z.coerce.string()),
});

export type CheckCartIntegritySchema = z.infer<typeof checkCartIntegritySchema>;
