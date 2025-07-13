export const keys = {
  base: ["analytics"],
  summary: (filters: { startDate?: string; endDate?: string }) => [
    ...keys.base,
    "summary",
    filters,
  ],
  productPerformance: (filters: { startDate?: string; endDate?: string }) => [
    ...keys.base,
    "product-performance",
    filters,
  ],
  tagPerformance: (filters: { startDate?: string; endDate?: string }) => [
    ...keys.base,
    "tag-performance",
    filters,
  ],
};
