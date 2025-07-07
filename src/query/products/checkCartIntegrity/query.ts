import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { productKeys } from "../config";
import { CheckCartIntegritySchema } from "./schema";

export const checkCartIntegrityOptions = ({
  productIds,
}: CheckCartIntegritySchema) =>
  queryOptions({
    queryKey: productKeys.cartIntegrity,
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      productIds.forEach((id) => searchParams.append("productIds", String(id)));

      return $fetch<Products.ListProducts>(
        `/api/cart/check? + ${searchParams.toString()}`
      );
    },
  });
