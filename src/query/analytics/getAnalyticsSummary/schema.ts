import { z } from "zod";

export const getAnalyticsSummarySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetAnalyticsSummarySchema = z.infer<
  typeof getAnalyticsSummarySchema
>;
