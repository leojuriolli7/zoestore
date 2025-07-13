import { z } from "zod";

export const getAnalyticsSummarySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  mode: z.enum(["last-week", "last-month", "custom"]).optional(),
});

export type GetAnalyticsSummarySchema = z.infer<
  typeof getAnalyticsSummarySchema
>;
