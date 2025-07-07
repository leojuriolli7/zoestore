"use client";

import { Header } from "@/components/header";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useOnScreen } from "@/hooks/useOnScreen";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { listTagsOptions } from "@/query/products/listTags/query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import debounce from "lodash.debounce";

export function ProductListPage() {
  const { data: _tags, isLoading: fetchingTags } = useQuery(listTagsOptions());
  const tags = _tags?.tags;

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const tagName = search.get("tag") as string;
  const searchQuery = search.get("search") as string;

  const [query, setQuery] = useState(searchQuery || "");

  const onInputChange = useMemo(
    () =>
      debounce((value: string) => {
        router.replace(
          pathname +
            "?" +
            new URLSearchParams({
              tag: tagName,
              search: value,
            })
        );
      }, 500),
    [router, pathname, tagName]
  );

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      listProductsOptions({
        limit: 20,
        ...(tagName && { tags: [tagName] }),
        ...(searchQuery && { search: searchQuery }),
      })
    );

  const products = data?.pages.flatMap((p) => p.results);

  const { ref: bottomRef, isIntersecting: isBottomVisible } =
    useOnScreen<HTMLDivElement>({ rootMargin: "100px" });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const otherTags = tags?.filter((tag) => tag.name !== tagName) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />

      <main className="container mx-auto px-4 pb-8">
        <div className="mb-6">
          <Link
            href="/"
            className="items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors  md:inline-flex hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-bold tracking-tight text-pretty text-neutral-foreground">
            {tagName ? (
              <>
                Explorando{" "}
                <span className="capitalize text-primary">{tagName}</span>
              </>
            ) : (
              "Nossos produtos"
            )}
          </h1>
          <div className="relative w-full md:max-w-sm">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);

                onInputChange.cancel();
                onInputChange(e.target.value);
              }}
              placeholder="Pesquisar nesta categoria..."
              className="w-full"
            />
          </div>
        </div>

        {!fetchingTags && otherTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-xs text-muted-foreground">
                Outras categorias:
              </span>{" "}
              {otherTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/products?tag=${tag.name}`}
                  className="text-xs text-muted-foreground hover:text-foreground underline capitalize transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="mb-2 text-2xl font-semibold text-neutral-foreground">
              Nenhum produto encontrado
            </h2>
            <p className="text-neutral-foreground/80">
              Tente ajustar sua busca ou explorar outras categorias.
            </p>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="mt-8 flex w-full justify-center">
            <LoadingSpinner />
          </div>
        )}

        <div ref={bottomRef} />
      </main>
    </div>
  );
}
