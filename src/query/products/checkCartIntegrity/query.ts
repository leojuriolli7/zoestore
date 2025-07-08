import { queryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { productKeys } from "../config";
import { CheckCartIntegritySchema } from "./schema";

export const checkCartIntegrityOptions = ({
  productSlugs,
}: CheckCartIntegritySchema) =>
  queryOptions({
    queryKey: productKeys.cartIntegrity,
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      productSlugs.forEach((slug) => searchParams.append("productSlugs", slug));

      return $fetch<Products.CardIntegrityStatus>(
        `/api/cart/check? + ${searchParams.toString()}`
      );
    },
  });
