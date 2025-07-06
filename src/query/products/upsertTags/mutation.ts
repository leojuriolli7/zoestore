import { productKeys } from "../config";
import type { UpsertTagsSchema } from "./schema";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";
import { MutationOptions } from "@tanstack/react-query";

export const upsertTagsOptions = (): MutationOptions<
  Products.UpsertTags,
  Error,
  UpsertTagsSchema
> => ({
  mutationKey: productKeys.upsertTags,
  mutationFn: (data: UpsertTagsSchema) =>
    $fetch<Products.UpsertTags>("/api/products/tags", {
      method: "POST",
      body: data,
    }),
});
