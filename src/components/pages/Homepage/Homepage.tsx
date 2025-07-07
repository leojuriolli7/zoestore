"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { HomepageSlider } from "./HomepageSlider";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/ProductCard";
import { useOnScreen } from "@/hooks/useOnScreen";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Products } from "@/query/products/types";
import dynamic from "next/dynamic";
import HomepageTagsSkeleton from "./HomepageTagsSkeleton";

const HomepageTags = dynamic(() => import("./HomepageTags"), {
  ssr: false,
  loading: HomepageTagsSkeleton,
});

export default function Homepage({
  products: initialProducts,
  tags: initialTags,
}: {
  products: InfiniteData<Products.ListProducts, number>;
  tags: Products.ListHomepageTags;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...listProductsOptions({ limit: 20 }),
      ...(initialProducts && {
        initialData: initialProducts,
      }),
    });

  const products = data?.pages.flatMap((p) => p.results);

  const { ref: bottomRef, isIntersecting: isBottomVisible } =
    useOnScreen<HTMLDivElement>({ rootMargin: "100px" });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />

      <section className="relative">
        <HomepageSlider />
      </section>

      <HomepageTags initialTags={initialTags} />

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl text-neutral-foreground text-center font-bold tracking-tight mb-2">
              Nossos produtos
            </h2>
            <p className="text-neutral-foreground/80 text-center">
              Peças selecionadas para a mulher moderna
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>

          {(isLoading || isFetchingNextPage) && (
            <div className="flex w-full justify-center mt-4">
              <LoadingSpinner />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </section>

      <WhatsAppFloatingButton />
    </div>
  );
}
