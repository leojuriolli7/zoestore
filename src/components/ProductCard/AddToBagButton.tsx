"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useShoppingBagStore } from "@/stores/shoppingBag";
import { cn } from "@/lib/utils";
import { MouseEvent, useCallback } from "react";
import type { Products } from "@/query/products/types";

interface AddToBagButtonProps {
  product: Products.Product;
}

export function AddToBagButton({ product }: AddToBagButtonProps) {
  const products = useShoppingBagStore((s) => s.products);
  const toggleProduct = useShoppingBagStore((s) => s.toggleProduct);
  const isAddedToBag = products.some((p) => p.slug === product?.slug);

  const addOrRemoveFromBag = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      toggleProduct(product);
    },
    [toggleProduct, product]
  );

  return (
    <button
      onClick={addOrRemoveFromBag}
      type="button"
      className={cn(
        "absolute top-2 right-2 p-2 rounded-full shadow-md group-hover:block hidden cursor-pointer",
        "transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95",
        "backdrop-blur-sm border border-white/20",
        isAddedToBag
          ? "bg-green-600 hover:bg-green-700 shadow-green-500/25 shadow-lg"
          : "bg-background/80 hover:bg-background/90 hover:shadow-lg"
      )}
    >
      <span className="sr-only">Adicionar produto à sua sacola.</span>
      <div className="relative size-5 overflow-hidden">
        <ShoppingBag
          className={cn(
            "absolute inset-0 size-5 text-foreground transition-all duration-300 ease-in-out",
            isAddedToBag
              ? "opacity-0 scale-50 rotate-45 translate-y-2"
              : "opacity-100 scale-100 rotate-0 translate-y-0"
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 size-5 text-white transition-all duration-300 ease-in-out",
            isAddedToBag
              ? "opacity-100 scale-100 rotate-0 translate-y-0"
              : "opacity-0 scale-50 -rotate-45 -translate-y-2"
          )}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300 ease-out pointer-events-none",
          "before:absolute before:inset-0 before:rounded-full before:bg-white/30",
          "before:scale-0 before:transition-transform before:duration-300",
          "active:before:scale-150 active:before:opacity-0"
        )}
      />
    </button>
  );
}
