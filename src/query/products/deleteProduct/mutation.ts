import { keys } from "../config";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";

export const deleteProductOptions = (id: number) => ({
  mutationKey: [keys.deleteProduct, id],
  mutationFn: () =>
    $fetch<Products.DeleteProduct>(`/api/products/${id}`, {
      method: "DELETE",
    }),
});
