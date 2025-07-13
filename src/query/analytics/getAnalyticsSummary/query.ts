import { queryOptions } from "@tanstack/react-query";
import { GetAnalyticsSummarySchema } from "./schema";
import { keys } from "../config";
import { $fetch } from "@/query/core/fetch";
import { Analytics } from "../types";

export const getAnalyticsSummaryQuery = (params: GetAnalyticsSummarySchema) => {
  return queryOptions({
    queryKey: keys.summary(params),
    queryFn: () =>
      $fetch<Analytics.AnalyticsSummary>(
        `/api/analytics/summary?startDate=${params.startDate || ""}&endDate=${
          params.endDate || ""
        }`
      ),
  });
};
