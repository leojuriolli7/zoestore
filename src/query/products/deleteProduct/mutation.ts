import { keys } from "../config";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";
import { DeleteProductsSchema } from "./schema";

export const deleteProductOptions = () => ({
  mutationKey: [keys.deleteProduct],
  mutationFn: (variables: DeleteProductsSchema) =>
    $fetch<Products.DeleteProduct>(`/api/products`, {
      method: "DELETE",
      body: variables,
    }),
});
