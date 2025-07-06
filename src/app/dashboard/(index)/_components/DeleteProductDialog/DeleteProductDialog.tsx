"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProductDialogStore } from "./store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductOptions } from "@/query/products/deleteProduct/mutation";
import { useCallback } from "react";
import { toastError } from "@/query/core/toastError";
import { keys } from "@/query/products/config";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteProductDialog() {
  const { open, product, setOpen } = useDeleteProductDialogStore();

  const queryClient = useQueryClient();

  const { mutateAsync: deleteProduct, isPending: deleting } = useMutation(
    deleteProductOptions()
  );

  const deleteFromDatabase = useCallback(() => {
    if (!product) return;

    deleteProduct({ ids: [product.id] })
      .then(() => {
        setOpen(false);

        toast.success("Produto deletado com sucesso.");

        queryClient.invalidateQueries({
          queryKey: keys.listProducts,
          exact: false,
        });
      })
      .catch((error) => {
        toastError(error.message);
      });
  }, [setOpen, deleteProduct, product, queryClient]);

  return (
    <AlertDialog open={open} onOpenChange={(v: boolean) => setOpen(v)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar produto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o produto <b>{product?.name}</b>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={deleteFromDatabase}
            loading={deleting}
          >
            Deletar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
