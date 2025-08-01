import { AnalyticsEvents } from "@/query/analytics/logEvent/events.enum";
import { logEvent } from "@/query/analytics/logEvent/client";
import type { Products } from "@/query/products/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartStore = {
  products: Products.Product[];
  addProduct: (p: Products.Product) => void;
  removeProduct: (id: string) => void;
  toggleProduct: (p: Products.Product) => void;
  clearBag: () => void;
};

export const useShoppingBagStore = create(
  persist<CartStore>(
    (set) => ({
      products: [],
      clearBag() {
        return set({ products: [] });
      },
      addProduct(p) {
        logEvent({
          eventType: AnalyticsEvents.add_to_bag,
          productId: p.id,
          referrer: document.referrer,
        });
        return set((state) =>
          state.products.some((product) => product.slug === p.slug)
            ? { products: state.products }
            : {
                products: [p, ...state.products],
              }
        );
      },
      removeProduct(slugToRemove) {
        return set((state) => {
          const removed = state.products.filter((p) => p.slug !== slugToRemove);
          return { products: removed };
        });
      },
      toggleProduct(p) {
        return set((state) => {
          const productExists = state.products.some(
            (product) => product.id === p.id
          );

          if (productExists) {
            const updatedProducts = state.products.filter(
              (product) => product.id !== p.id
            );

            return { products: updatedProducts };
          }

          logEvent({
            eventType: AnalyticsEvents.add_to_bag,
            productId: p.id,
            referrer: document.referrer,
          });

          return { products: [p, ...state.products] };
        });
      },
    }),
    {
      name: "zoe_shopping_cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
