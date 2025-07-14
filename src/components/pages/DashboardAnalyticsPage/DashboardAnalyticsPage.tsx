"use client";

import { listTagPerformanceQuery } from "@/query/analytics/listTagPerformance/query";
import { listProductPerformanceQuery } from "@/query/analytics/listProductPerformance/query";
import { getAnalyticsSummaryQuery } from "@/query/analytics/getAnalyticsSummary/query";
import {
  keepPreviousData,
  usePrefetchInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { DateFilter } from "./DateFilter/DateFilter";
import { useAnalyticsDateStore } from "./store";
import { ViewsAndConversionsChart } from "./charts/ViewsAndConversionsChart";
import { TrafficSourceChart } from "./charts/TrafficSourceChart";
import { ProductPerformanceTable } from "./ProductPerformanceTable/ProductPerformanceTable";
import { TagPerformanceTable } from "./TagPerformanceTable/TagPerformanceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "./StatCard/StatCard";

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

  /**
   * We prefetch both queries so that both Tabs already have data,
   * causing no layout shift for users (Flash of loading spinner) when
   * changing tabs.
   */

  usePrefetchInfiniteQuery(
    listTagPerformanceQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    })
  );

  usePrefetchInfiniteQuery(
    listProductPerformanceQuery({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    })
  );

  return (
    <div className="flex flex-col gap-4 py-6 px-2">
      <style lang="css">
        {`
        th, td {
          white-space: pre;
        }
          `}
      </style>

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

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Análise de performance</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Analise as visualizações e interesse dos visitantes em produtos ou
          categorias específicas
        </p>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="tags">Categorias</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductPerformanceTable />
          </TabsContent>
          <TabsContent value="tags">
            <TagPerformanceTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
