import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { productKeys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useQuery(getProductBySlugOptions('slug'))
 * ```
 */
export const getProductBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: productKeys.getBySlug(slug),
    queryFn: async () => $fetch<Products.Product>(`/api/products/${slug}`),
  });
