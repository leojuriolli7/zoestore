import "server-only";
import { db } from "@/query/db";
import { analyticsEvents } from "@/query/db/schema";
import type { LogEventSchema } from "./schema";
import type { Analytics } from "../types";

export async function logEvent(
  args: LogEventSchema
): Promise<Analytics.LogEvent> {
  await db.insert(analyticsEvents).values({
    eventType: args.eventType,
    productId: args.productId,
    referrer: args.referrer,
    utmSource: args.utmSource,
    sessionId: args.sessionId,
  });

  return { success: true };
}
