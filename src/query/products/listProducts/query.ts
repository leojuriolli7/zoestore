import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

function getQueryKey(key: Array<string>, search?: string) {
  if (search) return [...key, { search }];

  return key;
}

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useInfiniteQuery(listProductsOptions())
 * ```
 */
export const listProductsOptions = ({
  limit = 10,
  search,
}: {
  limit: number;
  search?: string;
}) =>
  infiniteQueryOptions({
    queryKey: getQueryKey(keys.listProducts, search),
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(
        `/api/products?cursor=${pageParam}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`
      ),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
