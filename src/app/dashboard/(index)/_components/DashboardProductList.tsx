"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { useOnScreen } from "@/hooks/useOnScreen";
import React, { useCallback, useEffect } from "react";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "./AddProductDialog";
import Image from "next/image";

export function DashboardProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery(listProductsOptions({ admin: true, limit: 10 }));

  const { ref: bottomRef, isIntersecting: isBottomVisible } =
    useOnScreen<HTMLDivElement>({ rootMargin: "100px" });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEdit = useCallback((id: number) => {
    alert(`Editar produto ${id}`);
  }, []);

  const handleDelete = useCallback((id: number) => {
    alert(`Excluir produto ${id}`);
  }, []);

  if (status === "error") {
    return `ERROR: ${error.message}`;
  }

  return (
    <div className="flex flex-col gap-4 md:p-10 p-4 max-w-[1800px] mx-auto">
      <header className="flex justify-between items-center mb-6">
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
        <AddProductDialog />
      </header>

      {status === "pending" && (
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {data?.pages?.map((page, i) => (
          <React.Fragment key={i}>
            {page?.results?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div ref={bottomRef} />

      {isFetchingNextPage && <div>Carregando mais...</div>}
    </div>
  );
}
