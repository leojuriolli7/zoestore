import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useQuery(getProductByIdOptions(1))
 * ```
 */
export const getProductByIdOptions = (id: number) =>
  queryOptions({
    queryKey: keys.getById(id),
    queryFn: async () => $fetch<Products.Product>(`/api/products/${id}`),
  });
