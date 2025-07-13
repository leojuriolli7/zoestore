"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummaryQuery } from "@/query/analytics/getAnalyticsSummary/query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "./DateRangePicker";
import { useAnalyticsDateStore } from "./store";
import { ViewsAndConversionsChart } from "./charts/ViewsAndConversionsChart";
import { TrafficSourceChart } from "./charts/TrafficSourceChart";
import { ProductPerformanceTable } from "./ProductPerformanceTable/ProductPerformanceTable";
import { TagPerformanceTable } from "./TagPerformanceTable/TagPerformanceTable";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardAnalyticsPage() {
  const { startDate, endDate } = useAnalyticsDateStore();
  const { data, isLoading: fetchingSummary } = useQuery({
    ...getAnalyticsSummaryQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-4 py-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Análises</h1>

        <DateRangePicker />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Visualizações Totais</CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingSummary ? (
              <LoadingSpinner />
            ) : (
              <p className="text-2xl font-bold">{data?.totalViews ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Adicionados à Sacola</CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingSummary ? (
              <LoadingSpinner />
            ) : (
              <p className="text-2xl font-bold">{data?.totalAddToBag ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Cliques no WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingSummary ? (
              <LoadingSpinner />
            ) : (
              <p className="text-2xl font-bold">
                {data?.totalWhatsappClicks ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Taxa de Conversão Geral
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>(Cliques no WhatsApp / Visualizações) * 100</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingSummary ? (
              <LoadingSpinner />
            ) : (
              <p className="text-2xl font-bold">
                {data?.overallConversionRate.toFixed(2) ?? 0}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ViewsAndConversionsChart data={data?.viewsAndConversions ?? []} />
        <TrafficSourceChart data={data?.trafficSourceBreakdown ?? []} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <ProductPerformanceTable />
        <TagPerformanceTable />
      </div>
    </div>
  );
}
