import "server-only";
import { db } from "@/query/db";
import { analyticsEvents, productMedias, products } from "@/query/db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { ListProductPerformanceSchema } from "./schema";
import { Analytics } from "../types";
import { AnalyticsEvents } from "../logEvent/events.enum";
import { API } from "@/query/core/query";

export async function listProductPerformance(
  params: ListProductPerformanceSchema
): Promise<API.InfiniteListResult<Analytics.ProductPerformance>> {
  const { startDate, endDate, limit = 10, cursor = 0 } = params;

  const dateFilter = and(
    startDate ? gte(analyticsEvents.createdAt, new Date(startDate)) : undefined,
    endDate ? lte(analyticsEvents.createdAt, new Date(endDate)) : undefined
  );

  const performanceQuery = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      medias: sql<
        { url: string }[]
      >`json_agg(json_build_object('url', product_medias.media_url))`,
      views: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
      ),
      addToBag: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.add_to_bag} THEN 1 ELSE NULL END`
      ),
      whatsappClicks: count(
        sql`CASE WHEN ${analyticsEvents.eventType} in (${AnalyticsEvents.whatsapp_click}, ${AnalyticsEvents.whatsapp_click_bag}) THEN 1 ELSE NULL END`
      ),
    })
    .from(products)
    .leftJoin(analyticsEvents, eq(products.id, analyticsEvents.productId))
    .leftJoin(productMedias, eq(products.id, productMedias.productId))
    .where(and(dateFilter, eq(productMedias.isPrimary, true)))
    .groupBy(products.id)
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
