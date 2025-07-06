import { productKeys } from "../config";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";

export const addProductOptions = () => ({
  mutationKey: productKeys.addProduct,
  mutationFn: (data: AddProductSchema) =>
    $fetch<Products.AddProduct>("/api/products", {
      method: "POST",
      body: data,
    }),
});
