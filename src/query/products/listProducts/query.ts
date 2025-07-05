import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useInfiniteQuery(listProductsOptions())
 * ```
 */
export const listProductsOptions = (options?: { admin: boolean }) =>
  infiniteQueryOptions({
    queryKey: options?.admin
      ? [...keys.listProducts, "admin"]
      : keys.listProducts,
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(`/api/products?cursor=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
