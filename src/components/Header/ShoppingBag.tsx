"use client";

import { checkCartIntegrityOptions } from "@/query/products/checkCartIntegrity/query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBagIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useShoppingBagStore } from "@/app/stores/cart";
import Link from "next/link";
import { A_MINUTE } from "@/lib/time";
import { appClientConfig } from "@/config/client";

function ShoppingBag() {
  const { products, removeProduct } = useShoppingBagStore();

  const productIds = useMemo(() => products.map((p) => p.id), [products]);

  const { isLoading: checkingIntegrity } = useQuery({
    ...checkCartIntegrityOptions({ productIds }),
    staleTime: A_MINUTE * 5,
    enabled: productIds.length > 0,
  });

  if (checkingIntegrity) {
    return (
      <div className="space-y-6 p-4">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
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
      <div className="space-y-6 p-4 h-[calc(100dvh-240px)] overflow-y-scroll scrollbar-hide">
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
                <h4 className="font-medium line-clamp-2">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  R$ {Number(product.price).toFixed(2)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProduct(product.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
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
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5" />
            Sacola ({totalItems})
          </SheetTitle>
          <SheetDescription>
            Gerencie os produtos da sua sacola de compras
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          <ShoppingBag />

          {products.length > 0 && (
            <>
              <div className="space-y-4 p-4 border-t sticky bottom-0 left-0 bg-background">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">
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
