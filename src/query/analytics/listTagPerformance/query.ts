import { infiniteQueryOptions } from "@tanstack/react-query";
import { ListTagPerformanceSchema } from "./schema";
import { keys } from "../config";
import { $fetch } from "@/query/core/fetch";
import { Analytics } from "../types";
import { API } from "@/query/core/query";

export const listTagPerformanceQuery = (params: ListTagPerformanceSchema) => {
  return infiniteQueryOptions({
    queryKey: keys.tagPerformance(params),
    queryFn: ({ pageParam = 0 }) =>
      $fetch<API.InfiniteListResult<Analytics.TagPerformance>>(
        `/api/analytics/tag-performance?startDate=${
          params.startDate || ""
        }&endDate=${params.endDate || ""}&cursor=${pageParam}`
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
};
