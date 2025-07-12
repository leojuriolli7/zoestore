"use client";

import { AnalyticsEvents } from "@/query/analytics/logEvent/events.enum";
import { logEvent } from "@/query/analytics/logEvent/client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ProductAnalyticsTrackerProps = {
  productId: number;
};

export function ProductAnalyticsTracker({
  productId,
}: ProductAnalyticsTrackerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");

    logEvent({
      eventType: AnalyticsEvents.product_view,
      productId,
      referrer: document.referrer,
      utmSource: utmSource || undefined,
    });
  }, [productId, searchParams]);

  return null;
}
