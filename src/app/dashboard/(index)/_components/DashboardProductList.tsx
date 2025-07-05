"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useOnScreen } from "@/hooks/useOnScreen";
import React, { useEffect } from "react";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { Skeleton } from "@/components/ui/skeleton";
import { UpsertProductDialog } from "./UpsertProductDialog/UpsertProductDialog";
import Image from "next/image";
import { ProductsTable } from "./ProductsTable/ProductsTable";
import { DeleteProductDialog } from "./DeleteProductDialog/DeleteProductDialog";

export function DashboardProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery(listProductsOptions({ limit: 10 }));

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
    <div className="flex flex-col gap-4 md:p-10 p-4 max-w-[1800px] mx-auto">
      <header className="flex justify-between items-center pb-6 border-b">
        <div className="flex items-center gap-2">
          <Image
            src="/zoe_store_logo.jpg"
            className="rounded-full object-cover"
            width={48}
            height={48}
            alt="Zoe Store"
          />

          <h1 className="sm:text-2xl text-xl font-bold">Gerenciar Produtos</h1>
        </div>

        <UpsertProductDialog />
      </header>

      {status === "pending" && (
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {products && <ProductsTable data={products} />}

      <div ref={bottomRef} />

      {isFetchingNextPage && <div>Carregando mais...</div>}

      <DeleteProductDialog />
    </div>
  );
}
