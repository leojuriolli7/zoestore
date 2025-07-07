"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useShoppingBagStore } from "@/app/stores/shoppingBag";
import { useCallback } from "react";
import type { Products } from "@/query/products/types";

interface AddToBagButtonProps {
  product: Products.Product;
}

export function AddToBagButton({ product }: AddToBagButtonProps) {
  const toggleProduct = useShoppingBagStore((s) => s.toggleProduct);
  const products = useShoppingBagStore((s) => s.products);
  const isAddedToBag = products.some((p) => p.id === product.id);

  const addOrRemoveFromBag = useCallback(() => {
    toggleProduct(product);
  }, [toggleProduct, product]);

  return (
    <Button
      variant={isAddedToBag ? "default" : "outline"}
      onClick={addOrRemoveFromBag}
      size="lg"
      className="w-full md:w-auto"
    >
      <ShoppingBag />
      {isAddedToBag ? "Na sacola" : "Adicionar à sacola"}
    </Button>
  );
}
