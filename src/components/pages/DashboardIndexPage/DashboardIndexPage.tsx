"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useOnScreen } from "@/hooks/useOnScreen";
import React, { useEffect } from "react";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { ProductsTable } from "./ProductsTable/ProductsTable";
import { DeleteProductDialog } from "./DeleteProductDialog/DeleteProductDialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useProductsSearchInputStore } from "./ProductsTable/TableFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { UpsertProductDialog } from "./UpsertProductDialog/UpsertProductDialog";
import { UpsertTagsDialog } from "./UpsertTagsDialog";

export function DashboardIndexPage() {
  const { query, tags } = useProductsSearchInputStore();
  const debouncedQuery = useDebounce(query, 400);
  const debouncedTags = useDebounce(tags, 400);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    ...listProductsOptions({
      limit: 10,
      search: debouncedQuery,
      tags: debouncedTags,
    }),
    placeholderData: keepPreviousData,
  });

  const { ref: bottomRef, isIntersecting: isBottomVisible } =
    useOnScreen<HTMLDivElement>({ rootMargin: "100px" });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    return `ERROR: ${error.message}`;
  }

  const products = data?.pages.flatMap((p) => p.results);

  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>

        <div className="flex items-center gap-2">
          <UpsertProductDialog />
          <UpsertTagsDialog />
        </div>
      </div>

      {status === "pending" && (
        <div className="w-full flex justify-center align-center mt-20">
          <LoadingSpinner className="size-8" />
        </div>
      )}

      {products && <ProductsTable data={products} />}

      <div ref={bottomRef} />

      {isFetchingNextPage && (
        <div className="flex justify-center w-full">
          <LoadingSpinner />
        </div>
      )}

      <DeleteProductDialog />
    </div>
  );
}
