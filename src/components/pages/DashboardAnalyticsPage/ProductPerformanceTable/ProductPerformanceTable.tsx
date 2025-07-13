"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useAnalyticsDateStore } from "../store";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { listProductPerformanceQuery } from "@/query/analytics/listProductPerformance/query";
import { useOnScreen } from "@/hooks/useOnScreen";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export function ProductPerformanceTable() {
  const { startDate, endDate } = useAnalyticsDateStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...listProductPerformanceQuery({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }),

      placeholderData: keepPreviousData,
    });

  const { ref, isIntersecting } = useOnScreen<HTMLDivElement>({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div>
      <h2 className="text-xl font-semibold">Performance dos Produtos</h2>

      <p className="text-sm text-muted-foreground mb-2">
        Analise as visualizações e interesse dos visitantes em cada produto.
      </p>

      <DataTable columns={columns} data={products} />

      <div ref={ref} className="hidden lg:block" />

      <Button
        className="w-full lg:hidden block mt-2"
        onClick={() => fetchNextPage()}
      >
        Carregar mais
      </Button>

      {isFetchingNextPage && (
        <div className="w-full flex justify-center items-center mt-2">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
