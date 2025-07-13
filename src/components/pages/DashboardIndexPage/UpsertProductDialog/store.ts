import { Products } from "@/query/products/types";
import { create } from "zustand";

type Store = {
  open: boolean;
  setOpen: (value: boolean, product?: Products.Product) => void;
  product: Products.Product | null;
};

export const useUpertProductStore = create<Store>((set) => ({
  open: false,
  product: null,
  setOpen: (value, product) => set({ open: value, product: product || null }),
}));
