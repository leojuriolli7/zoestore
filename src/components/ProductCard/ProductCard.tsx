import type { Products } from "@/query/products/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToBagButton } from "./AddToBagButton";
import { ProductImage } from "./ProductImage";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <div className="space-y-2 p-1">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Products.Product }) {
  return (
    <Link href={`/products/${product.slug}`} key={product.id}>
      <Card className="group cursor-pointer border-0 bg-transparent shadow-none py-0">
        <CardContent className="p-0 w-full h-auto">
          <div className="relative overflow-hidden rounded-t-lg aspect-[2/3] w-full">
            <ProductImage medias={product.medias} name={product.name} />
            <Button
              variant="default"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute w-10/12 left-1/2 bottom-[-3rem] -translate-x-1/2 px-4 py-2 text-xs md:text-sm rounded-md shadow transition-all duration-300 opacity-0 group-hover:bottom-4 group-hover:opacity-100"
            >
              Clique para ver mais
            </Button>

            <AddToBagButton product={product} />
          </div>
          <div className="p-3 md:p-4">
            <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 text-neutral-foreground">
              {product.name}
            </h3>

            <div className="flex items-center space-x-2">
              <span className="font-light text-sm md:text-base text-neutral-foreground">
                R$ {Number(product.price).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
