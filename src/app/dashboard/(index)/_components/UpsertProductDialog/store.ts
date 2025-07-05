import { Products } from "@/query/products/types";
import { create } from "zustand";

type ProductToUpdate = Products.Product & { imageFile: File };

type Store = {
  open: boolean;
  setOpen: (value: boolean, product?: ProductToUpdate) => void;
  product: ProductToUpdate | null;
};

export const useUpertProductStore = create<Store>((set) => ({
  open: false,
  product: null,
  setOpen: (value, product) => set({ open: value, product: product || null }),
}));
