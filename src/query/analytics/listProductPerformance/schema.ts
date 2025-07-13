import { z } from "zod";

export const listProductPerformanceSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().optional(),
  cursor: z.coerce.number().optional(),
});

export type ListProductPerformanceSchema = z.infer<
  typeof listProductPerformanceSchema
>;
