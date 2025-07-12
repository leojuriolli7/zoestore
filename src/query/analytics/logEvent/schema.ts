import { z } from "zod";
import { AnalyticsEvents } from "./events.enum";

export const logEventSchema = z.object({
  eventType: z.nativeEnum(AnalyticsEvents),
  productId: z.number().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  sessionId: z.string(),
});

export type LogEventSchema = z.infer<typeof logEventSchema>;
