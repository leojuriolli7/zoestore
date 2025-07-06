import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

export const listTagsOptions = () =>
  queryOptions({
    queryKey: keys.listTags,
    queryFn: async () => $fetch<Products.ListTags>("/api/products/tags"),
  });
