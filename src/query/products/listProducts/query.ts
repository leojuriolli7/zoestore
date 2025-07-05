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
export const listProductsOptions = ({
  limit = 10,
  ...options
}: {
  admin?: boolean;
  limit: number;
}) =>
  infiniteQueryOptions({
    queryKey: options?.admin
      ? [...keys.listProducts(limit), "admin"]
      : keys.listProducts(limit),
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(
        `/api/products?cursor=${pageParam}&limit=${limit}`
      ),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
