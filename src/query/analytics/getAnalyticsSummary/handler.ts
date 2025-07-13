import { db } from "@/query/db";
import { analyticsEvents } from "@/query/db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { GetAnalyticsSummarySchema } from "./schema";
import { Analytics } from "../types";
import { AnalyticsEvents } from "../logEvent/events.enum";

export async function getAnalyticsSummary(
  params: GetAnalyticsSummarySchema
): Promise<Analytics.AnalyticsSummary> {
  const { startDate, endDate } = params;

  const dateFilter = and(
    startDate ? gte(analyticsEvents.createdAt, new Date(startDate)) : undefined,
    endDate ? lte(analyticsEvents.createdAt, new Date(endDate)) : undefined
  );

  const totalViewsQuery = db
    .select({
      value: count(),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, AnalyticsEvents.product_view),
        dateFilter
      )
    );

  const totalAddToBagQuery = db
    .select({
      value: count(),
    })
    .from(analyticsEvents)
    .where(
      and(eq(analyticsEvents.eventType, AnalyticsEvents.add_to_bag), dateFilter)
    );

  const totalWhatsappClicksQuery = db
    .select({
      value: count(),
    })
    .from(analyticsEvents)
    .where(
      and(
        sql`${analyticsEvents.eventType} in (${AnalyticsEvents.whatsapp_click}, ${AnalyticsEvents.whatsapp_click_bag})`,
        dateFilter
      )
    );

  const viewsAndConversionsQuery = db
    .select({
      date: sql<string>`DATE_TRUNC('day', ${analyticsEvents.createdAt})`,
      views: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
      ),
      conversions: count(
        sql`CASE WHEN ${analyticsEvents.eventType} in (${AnalyticsEvents.whatsapp_click}, ${AnalyticsEvents.whatsapp_click_bag}) THEN 1 ELSE NULL END`
      ),
    })
    .from(analyticsEvents)
    .where(dateFilter)
    .groupBy(sql`DATE_TRUNC('day', ${analyticsEvents.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${analyticsEvents.createdAt})`);

  const trafficSourceBreakdownQuery = db
    .select({
      referrer: analyticsEvents.referrer,
      views: count(
        sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
      ),
      conversions: count(
        sql`CASE WHEN ${analyticsEvents.eventType} in (${AnalyticsEvents.whatsapp_click}, ${AnalyticsEvents.whatsapp_click_bag}) THEN 1 ELSE NULL END`
      ),
    })
    .from(analyticsEvents)
    .where(dateFilter)
    .groupBy(analyticsEvents.referrer);

  const [
    totalViewsResult,
    totalAddToBagResult,
    totalWhatsappClicksResult,
    viewsAndConversions,
    trafficSourceBreakdownResult,
  ] = await Promise.all([
    totalViewsQuery,
    totalAddToBagQuery,
    totalWhatsappClicksQuery,
    viewsAndConversionsQuery,
    trafficSourceBreakdownQuery,
  ]);

  const totalViews = totalViewsResult[0].value;
  const totalAddToBag = totalAddToBagResult[0].value;
  const totalWhatsappClicks = totalWhatsappClicksResult[0].value;

  const overallConversionRate =
    totalViews > 0 ? (totalWhatsappClicks / totalViews) * 100 : 0;

  const trafficSourceBreakdown = trafficSourceBreakdownResult.map((row) => ({
    referrer: row.referrer ?? "Direto",
    views: row.views,
    conversionRate: row.views > 0 ? (row.conversions / row.views) * 100 : 0,
  }));

  return {
    totalViews,
    totalAddToBag,
    totalWhatsappClicks,
    overallConversionRate,
    viewsAndConversions,
    trafficSourceBreakdown,
  };
}
