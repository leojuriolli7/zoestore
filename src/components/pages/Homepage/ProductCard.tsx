import type { Products } from "@/query/products/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_ViewTransition as ViewTransition } from "react";

export function ProductCard({ product }: { product: Products.Product }) {
  return (
    <Link prefetch={false} href={`/products/${product.id}`} key={product.id}>
      <Card className="group cursor-pointer border-0 bg-transparent shadow-none py-0">
        <CardContent className="p-0 w-full h-auto">
          <div className="relative overflow-hidden rounded-t-lg aspect-[2/3] w-full group/image">
            <ViewTransition name={`product-image-${product.id}`}>
              <Image
                fill
                src={product.image_url}
                alt={product.name}
                className="object-cover rounded-md select-none"
              />
            </ViewTransition>
            <Button
              variant="default"
              className="absolute w-10/12 left-1/2 bottom-[-3rem] -translate-x-1/2 px-4 py-2 text-xs md:text-sm rounded-md shadow transition-all duration-300 opacity-0 group-hover/image:bottom-4 group-hover/image:opacity-100"
            >
              Clique para ver mais
            </Button>
          </div>
          <div className="p-3 md:p-4">
            <h3 className="font-medium text-sm md:text-base mb-2 line-clamp-2">
              {product.name}
            </h3>
            {/* <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs md:text-sm text-muted-foreground ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div> */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm md:text-base">
                R$ {Number(product.price).toFixed(2)}
              </span>
              {/* {product.originalPrice && (
                        <span className="text-xs md:text-sm text-muted-foreground line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )} */}
            </div>
            {/* <p className="text-xs text-muted-foreground mt-1">
                      ou 3x de R$ {(product.price / 3).toFixed(2)}
                    </p> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
