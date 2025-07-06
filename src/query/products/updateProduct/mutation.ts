import { keys } from "../config";
import type { UpdateProductSchema } from "./schema";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";

export const updateProductOptions = (slug: string) => ({
  mutationKey: keys.updateProduct(slug),
  mutationFn: (data: UpdateProductSchema) =>
    $fetch<Products.UpdateProduct>(`/api/products/${slug}`, {
      method: "POST",
      body: data,
    }),
});
