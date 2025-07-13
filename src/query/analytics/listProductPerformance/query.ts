import { infiniteQueryOptions } from "@tanstack/react-query";
import { ListProductPerformanceSchema } from "./schema";
import { keys } from "../config";
import { $fetch } from "@/query/core/fetch";
import { Analytics } from "../types";
import { API } from "@/query/core/query";

export const listProductPerformanceQuery = (
  params: ListProductPerformanceSchema
) => {
  return infiniteQueryOptions({
    queryKey: keys.productPerformance(params),
    queryFn: ({ pageParam = 0 }) =>
      $fetch<API.InfiniteListResult<Analytics.ProductPerformance>>(
        `/api/analytics/product-performance?startDate=${
          params.startDate || ""
        }&endDate=${params.endDate || ""}&cursor=${pageParam}`
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
};
