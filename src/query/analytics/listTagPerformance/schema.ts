import { z } from "zod";

export const listTagPerformanceSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().optional(),
  cursor: z.coerce.number().optional(),
});

export type ListTagPerformanceSchema = z.infer<typeof listTagPerformanceSchema>;
