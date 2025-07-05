import { keys } from "../config";
import type { UpdateProductSchema } from "./schema";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";

export const updateProductOptions = (id: number) => ({
  mutationKey: keys.updateProduct(id),
  mutationFn: (data: UpdateProductSchema) =>
    $fetch<Products.UpdateProduct>(`/api/products/${id}`, {
      method: "POST",
      body: data,
    }),
});
