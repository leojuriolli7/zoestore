import "server-only";
import { db } from "@/query/db";
import { analyticsEvents } from "@/query/db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { GetAnalyticsSummarySchema } from "./schema";
import { Analytics } from "../types";
import { AnalyticsEvents } from "../logEvent/events.enum";
import {
  subWeeks,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

async function getSummaryForPeriod(startDate?: Date, endDate?: Date) {
  if (!startDate) {
    return {
      totalViews: 0,
      totalAddToBag: 0,
      totalWhatsappClicks: 0,
      overallConversionRate: 0,
    };
  }

  const dateFilter = and(
    gte(analyticsEvents.createdAt, startDate),
    endDate ? lte(analyticsEvents.createdAt, endDate) : undefined
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
        eq(analyticsEvents.eventType, AnalyticsEvents.whatsapp_click),
        dateFilter
      )
    );

  const [totalViewsResult, totalAddToBagResult, totalWhatsappClicksResult] =
    await Promise.all([
      totalViewsQuery,
      totalAddToBagQuery,
      totalWhatsappClicksQuery,
    ]);

  const totalViews = totalViewsResult[0].value;
  const totalAddToBag = totalAddToBagResult[0].value;
  const totalWhatsappClicks = totalWhatsappClicksResult[0].value;

  const overallConversionRate =
    totalViews > 0 ? (totalWhatsappClicks / totalViews) * 100 : 0;

  return {
    totalViews,
    totalAddToBag,
    totalWhatsappClicks,
    overallConversionRate,
  };
}

export async function getAnalyticsSummary(
  params: GetAnalyticsSummarySchema
): Promise<Analytics.AnalyticsSummary> {
  const { startDate, endDate, mode } = params;

  const currentStartDate = startDate ? new Date(startDate) : undefined;
  const currentEndDate = endDate ? new Date(endDate) : undefined;

  let previousStartDate: Date | undefined;
  let previousEndDate: Date | undefined;

  if (mode === "last-week") {
    const today = new Date();
    previousStartDate = startOfWeek(subWeeks(today, 2));
    previousEndDate = endOfWeek(subWeeks(today, 2));
  } else if (mode === "last-month") {
    const today = new Date();
    previousStartDate = startOfMonth(subMonths(today, 2));
    previousEndDate = endOfMonth(subMonths(today, 2));
  }

  const [
    currentSummary,
    previousSummary,
    viewsAndConversions,
    trafficSourceBreakdownResult,
  ] = await Promise.all([
    getSummaryForPeriod(currentStartDate, currentEndDate),
    getSummaryForPeriod(previousStartDate, previousEndDate),
    db
      .select({
        date: sql<string>`DATE_TRUNC('day', ${analyticsEvents.createdAt})`,
        views: count(
          sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
        ),
        conversions: count(
          sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.whatsapp_click} THEN 1 ELSE NULL END`
        ),
      })
      .from(analyticsEvents)
      .where(
        and(
          currentStartDate
            ? gte(analyticsEvents.createdAt, currentStartDate)
            : undefined,
          currentEndDate
            ? lte(analyticsEvents.createdAt, currentEndDate)
            : undefined
        )
      )
      .groupBy(sql`DATE_TRUNC('day', ${analyticsEvents.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${analyticsEvents.createdAt})`),
    db
      .select({
        referrer: analyticsEvents.referrer,
        views: count(
          sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.product_view} THEN 1 ELSE NULL END`
        ),
        conversions: count(
          sql`CASE WHEN ${analyticsEvents.eventType} = ${AnalyticsEvents.whatsapp_click} THEN 1 ELSE NULL END`
        ),
      })
      .from(analyticsEvents)
      .where(
        and(
          currentStartDate
            ? gte(analyticsEvents.createdAt, currentStartDate)
            : undefined,
          currentEndDate
            ? lte(analyticsEvents.createdAt, currentEndDate)
            : undefined
        )
      )
      .groupBy(analyticsEvents.referrer),
  ]);

  const trafficSourceBreakdown = trafficSourceBreakdownResult.map((row) => ({
    referrer: row.referrer || "Acesso direto",
    views: row.views,
    conversionRate: row.views > 0 ? (row.conversions / row.views) * 100 : 0,
  }));

  return {
    totalViews: {
      current: currentSummary.totalViews,
      previous: previousSummary.totalViews,
    },
    totalAddToBag: {
      current: currentSummary.totalAddToBag,
      previous: previousSummary.totalAddToBag,
    },
    totalWhatsappClicks: {
      current: currentSummary.totalWhatsappClicks,
      previous: previousSummary.totalWhatsappClicks,
    },
    overallConversionRate: {
      current: currentSummary.overallConversionRate,
      previous: previousSummary.overallConversionRate,
    },
    viewsAndConversions,
    trafficSourceBreakdown,
  };
}
