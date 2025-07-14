import "server-only";
import { db } from "@/query/db";
import { analyticsEvents, productTags, tags } from "@/query/db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { ListTagPerformanceSchema } from "./schema";
import { Analytics } from "../types";
import { AnalyticsEvents } from "../logEvent/events.enum";
import { API } from "@/query/core/query";

export async function listTagPerformance(
  params: ListTagPerformanceSchema
): Promise<API.InfiniteListResult<Analytics.TagPerformance>> {
  const { startDate, endDate, limit = 10, cursor = 0 } = params;

  const dateFilter = and(
    startDate ? gte(analyticsEvents.createdAt, new Date(startDate)) : undefined,
    endDate ? lte(analyticsEvents.createdAt, new Date(endDate)) : undefined
  );

  const performanceQuery = db
    .select({
      id: tags.id,
      name: tags.name,
      views: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
      ),
      addToBag: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.add_to_bag} THEN 1 ELSE NULL END`
      ),
      whatsappClicks: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.whatsapp_click} THEN 1 ELSE NULL END`
      ),
    })
    .from(tags)
    .leftJoin(productTags, eq(tags.id, productTags.tagId))
    .leftJoin(
      analyticsEvents,
      eq(productTags.productId, analyticsEvents.productId)
    )
    .where(dateFilter)
    .groupBy(tags.id)
    .limit(limit)
    .offset(cursor * limit);

  const results = await performanceQuery;

  const data = results.map((row) => ({
    ...row,
    conversionRate: row.views > 0 ? (row.whatsappClicks / row.views) * 100 : 0,
  }));

  return {
    results: data,
    nextCursor: data.length === limit ? cursor + 1 : null,
  };
}
