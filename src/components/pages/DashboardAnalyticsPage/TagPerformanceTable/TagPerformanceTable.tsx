"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useAnalyticsDateStore } from "../store";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { listTagPerformanceQuery } from "@/query/analytics/listTagPerformance/query";
import { useOnScreen } from "@/hooks/useOnScreen";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";

export function TagPerformanceTable() {
  const startDate = useAnalyticsDateStore((s) => s.startDate);
  const endDate = useAnalyticsDateStore((s) => s.endDate);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...listTagPerformanceQuery({
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

  const tags = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner className="w-full mx-auto mt-6" />
      ) : (
        <DataTable columns={columns} data={tags} />
      )}

      <div ref={ref} />

      {isFetchingNextPage && (
        <div className="w-full flex justify-center items-center mt-2">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
