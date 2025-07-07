import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { productKeys } from "../config";

export const listHomepageTagsOptions = () =>
  queryOptions({
    queryKey: productKeys.listHomepageTags,
    queryFn: async () =>
      $fetch<Products.ListHomepageTags>("/api/products/tags/home"),
  });
