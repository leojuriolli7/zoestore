import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/ProductCard";
import { Header } from "@/components/header";

export function ProductListPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />

      <main className="container mx-auto px-4 pb-8">
        <div className="mb-6 pt-6">
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mb-8 flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-10 w-full md:max-w-sm" />
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        <div className="mt-8 flex w-full justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </main>
    </div>
  );
}
