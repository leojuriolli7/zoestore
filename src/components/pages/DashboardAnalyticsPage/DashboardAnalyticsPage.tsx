"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummaryQuery } from "@/query/analytics/getAnalyticsSummary/query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DateFilter } from "./DateFilter/DateFilter";
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
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  previousValue,
  loading,
  tooltip,
  isPercent = false,
}: {
  title: string;
  isPercent?: boolean;
  value: number;
  previousValue: number;
  loading: boolean;
  tooltip?: string;
}) {
  const percentageChange =
    previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;

  const isPositive = percentageChange >= 0;

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}

          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">
              {value.toFixed(2)}
              {isPercent ? "%" : ""}
            </p>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {isPositive ? <ArrowUp /> : <ArrowDown />}
              {percentageChange.toFixed(2)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardAnalyticsPage() {
  const { mode, startDate, endDate } = useAnalyticsDateStore();
  const { data, isLoading: fetchingSummary } = useQuery({
    ...getAnalyticsSummaryQuery({
      mode,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-4 py-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Análises</h1>

        <DateFilter />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Visualizações Totais"
          loading={fetchingSummary}
          value={data?.totalViews.current ?? 0}
          previousValue={data?.totalViews.previous ?? 0}
        />
        <StatCard
          title="Adicionados à Sacola"
          loading={fetchingSummary}
          value={data?.totalAddToBag.current ?? 0}
          previousValue={data?.totalAddToBag.previous ?? 0}
        />
        <StatCard
          title="Cliques no WhatsApp"
          loading={fetchingSummary}
          value={data?.totalWhatsappClicks.current ?? 0}
          previousValue={data?.totalWhatsappClicks.previous ?? 0}
        />
        <StatCard
          title="Taxa de Conversão Geral"
          isPercent
          loading={fetchingSummary}
          value={data?.overallConversionRate.current ?? 0}
          previousValue={data?.overallConversionRate.previous ?? 0}
          tooltip="(Cliques no WhatsApp / Visualizações) * 100"
        />
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
