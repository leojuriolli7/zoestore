import z from "zod";

export const checkCartIntegritySchema = z.object({
  productIds: z.array(z.coerce.number()),
});

export type CheckCartIntegritySchema = z.infer<typeof checkCartIntegritySchema>;
