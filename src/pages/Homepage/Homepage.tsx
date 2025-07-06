"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { HomepageSlider } from "./HomepageSlider";
import Link from "next/link";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Homepage() {
  const { data } = useInfiniteQuery(listProductsOptions({ limit: 20 }));
  const products = data?.pages.flatMap((p) => p.results);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative">
        <HomepageSlider />
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl text-center font-bold tracking-tight mb-2">
              Nossos produtos
            </h2>
            <p className="text-muted-foreground text-center">
              Peças selecionadas para a mulher moderna
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product) => (
              <Link
                prefetch={false}
                href={`/products/${product.id}`}
                key={product.id}
              >
                <Card className="group cursor-pointer border-0 bg-transparent shadow-none py-0">
                  <CardContent className="p-0 w-full h-auto">
                    <div className="relative overflow-hidden rounded-t-lg aspect-[2/3] w-full">
                      <Image
                        fill
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover rounded-md"
                      />
                      {/* <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button> */}
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
            ))}
          </div>
        </div>
      </section>

      <WhatsAppFloatingButton />
    </div>
  );
}
