import { productKeys } from "../config";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";
import { DeleteProductsSchema } from "./schema";

export const deleteProductOptions = () => ({
  mutationKey: productKeys.deleteProduct,
  mutationFn: (variables: DeleteProductsSchema) =>
    $fetch<Products.DeleteProduct>(`/api/products`, {
      method: "DELETE",
      body: variables,
    }),
});
