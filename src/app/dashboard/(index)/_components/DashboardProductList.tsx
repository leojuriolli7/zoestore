"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { useOnScreen } from "@/hooks/useOnScreen";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect } from "react";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery(listProductsOptions({ admin: true }));

  const { ref: bottomRef, isIntersecting: isBottomVisible } =
    useOnScreen<HTMLDivElement>({ rootMargin: "100px" });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEdit = useCallback((id: string) => {
    alert(`Editar produto ${id}`);
  }, []);

  const handleDelete = useCallback((id: string) => {
    alert(`Excluir produto ${id}`);
  }, []);

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-4 p-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return error.message;
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ZOE | Gerenciar Produtos</h1>
        <Button onClick={() => alert("Criar novo produto")}>
          Novo Produto
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {data.pages?.map((page, i) => (
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
