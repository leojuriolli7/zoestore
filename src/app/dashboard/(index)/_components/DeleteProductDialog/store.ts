import { Products } from "@/query/products/types";
import { create } from "zustand";

interface DeleteProductDialogState {
  open: boolean;
  product?: Products.Product;
  setOpen: (open: boolean, product?: Products.Product) => void;
}

export const useDeleteProductDialogStore = create<DeleteProductDialogState>(
  (set) => ({
    open: false,
    product: undefined,
    setOpen: (open, product) =>
      set(() => ({
        open,
        product: open ? product : undefined,
      })),
  })
);
