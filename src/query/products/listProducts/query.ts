import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { productKeys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useInfiniteQuery(listProductsOptions())
 * ```
 */
export const listProductsOptions = ({
  limit = 10,
  search = "",
  tags = [],
}: {
  limit: number;
  search?: string;
  tags?: string[];
}) =>
  infiniteQueryOptions({
    queryKey: [...productKeys.listProducts, { search, tags, limit }],
    queryFn: async ({ pageParam = 0 }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("cursor", pageParam.toString());

      if (limit) searchParams.set("limit", limit.toString());
      if (search) searchParams.set("search", search);
      if (tags) tags.forEach((tag) => searchParams.append("tags", tag));

      return $fetch<Products.ListProducts>(
        `/api/products?${searchParams.toString()}`
      );
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
