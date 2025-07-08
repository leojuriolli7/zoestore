"use client";

import { checkCartIntegrityOptions } from "@/query/products/checkCartIntegrity/query";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useShoppingBagStore } from "@/stores/shoppingBag";
import Link from "next/link";
import { A_MINUTE } from "@/lib/time";
import { appClientConfig } from "@/config/client";

function ShoppingBag() {
  const { products, removeProduct } = useShoppingBagStore();

  const productSlugs = useMemo(() => products.map((p) => p.slug), [products]);

  const { data: cartIntegrity } = useQuery({
    ...checkCartIntegrityOptions({ productSlugs }),
    staleTime: A_MINUTE * 5,
    enabled: productSlugs.length > 0,
  });

  /**
   * Whenever we receive the cart integrity data, we will check if the
   * current user cart has any invalid products. Invalid means products
   * that have been deleted or had their names and slug changed.
   */
  useEffect(() => {
    if (cartIntegrity) {
      const { invalid } = cartIntegrity;

      if (invalid?.length > 0) {
        invalid.forEach((invalidSlug) => {
          removeProduct(invalidSlug);
        });
      }
    }
  }, [cartIntegrity, removeProduct]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center pt-10 text-pretty">
        <ShoppingBagIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sua sacola está vazia</h3>
        <p className="text-muted-foreground mb-4">
          Adicione produtos à sua sacola para começar suas compras
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="space-y-6 pb-4 px-4 h-[calc(100dvh-210px)] overflow-y-scroll scrollbar-hide">
        {products.map((product) => (
          <SheetTrigger asChild key={product.id}>
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center space-x-4"
            >
              <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                <Image
                  src={product.image_url}
                  width={64}
                  height={64}
                  alt={`Modelo vestindo ${product.name}`}
                  className="rounded-md object-cover object-top w-16 h-16"
                />
              </div>

              <div className="flex-1 hover:underline">
                <h4 className="font-medium line-clamp-2 leading-snug">
                  {product.name}
                </h4>
                <p className="text-sm font-normal text-muted-foreground">
                  R$ {Number(product.price).toFixed(2)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  removeProduct(product.slug);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="h-8 w-8 text-foreground/60"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Link>
          </SheetTrigger>
        ))}
      </div>
    </div>
  );
}

export function ShoppingBagSheet() {
  const { products } = useShoppingBagStore();

  const totalItems = products.length;
  const totalPrice = products.reduce(
    (sum, product) => sum + (Number(product.price) || 0),
    0
  );

  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Olá! Gostaria de saber mais informações dos seguintes produtos:\n${products
        .map((p, i) => `${i + 1}. ${p.name}\n`)
        .join("")}`
    );
  }, [products]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-6 p-2 rounded-full transition-colors"
        >
          <ShoppingBagIcon className="size-6 text-neutral-foreground" />

          {totalItems > 0 && (
            <span
              key={totalItems}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs  animate-badge-bounce font-medium"
            >
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md gap-0">
        <SheetHeader className="pt-12">
          <SheetTitle className="flex items-center text-xl gap-2 font-normal justify-between">
            Sacola
            <span className="text-right font-normal text-base">
              ({totalItems} items)
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ShoppingBag />

          {products.length > 0 && (
            <>
              <div className="space-y-4 p-4 border-t sticky bottom-0 left-0 bg-background">
                <div className="flex justify-between items-center">
                  <span className="font-normal">Total:</span>
                  <span className="font-normal text-lg">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${appClientConfig.contact.whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    className="w-full text-white bg-whatsapp hover:bg-whatsapp/90"
                    size="lg"
                  >
                    Ir para o WhatsApp
                  </Button>
                </a>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
