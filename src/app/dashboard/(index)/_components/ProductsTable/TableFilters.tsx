import { DataTableFilterProps } from "@/components/data-table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { keys } from "@/query/products/config";
import { deleteProductOptions } from "@/query/products/deleteProduct/mutation";
import { Products } from "@/query/products/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { TagFilterSelector } from "./TagFilterSelector";

type Store = {
  query: string;
  setQuery: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
};

export const useProductsSearchInputStore = create<Store>((set) => ({
  query: "",
  setQuery: (val) => set({ query: val }),
  tags: [],
  setTags: (tags) => set({ tags }),
}));

export function TableFilters({
  table,
}: DataTableFilterProps<Products.Product>) {
  const selected = table.getFilteredSelectedRowModel()?.rows;

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteProducts, isPending: deleting } = useMutation(
    deleteProductOptions()
  );

  const clearSelection = useCallback(() => table.setRowSelection({}), [table]);

  const openConfirmationDialog = useCallback(() => {
    setConfirmDeleteOpen(true);
  }, [setConfirmDeleteOpen]);

  const closeConfirmationDialog = useCallback(() => {
    setConfirmDeleteOpen(false);
  }, [setConfirmDeleteOpen]);

  const handleDelete = useCallback(() => {
    deleteProducts({ ids: selected.map((p) => p.original.id) }).then(() => {
      queryClient.invalidateQueries({
        queryKey: keys.listProducts,
        exact: false,
      });

      toast.success(
        `${selected.length} ${
          selected.length === 1 ? "produto" : "produtos"
        } deletados.`
      );

      clearSelection();
      setConfirmDeleteOpen(false);
    });
  }, [
    setConfirmDeleteOpen,
    deleteProducts,
    clearSelection,
    queryClient,
    selected,
  ]);

  const { query, setQuery, tags, setTags } = useProductsSearchInputStore();

  return (
    <div className="flex flex-col sm:flex-row w-full gap-2 items-stretch sm:items-center">
      {selected?.length > 0 && (
        <div className="flex items-center gap-2 order-1 sm:-order-1">
          <Button variant="outline" onClick={clearSelection}>
            Limpar seleção
          </Button>

          <Button onClick={openConfirmationDialog} variant="destructive">
            Deletar {selected?.length}{" "}
            {selected.length === 1 ? "produto" : "produtos"}
          </Button>
          <AlertDialog
            open={confirmDeleteOpen}
            onOpenChange={setConfirmDeleteOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar {selected.length}{" "}
                  {selected.length === 1 ? "produto" : "produtos"}?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Esta ação é permanente e não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={deleting}
                  onClick={closeConfirmationDialog}
                >
                  Cancelar
                </AlertDialogCancel>
                <Button
                  loading={deleting}
                  onClick={handleDelete}
                  variant="destructive"
                >
                  Deletar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Input
        placeholder="Pesquisar todos os produtos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:w-80 bg-background"
      />
      <TagFilterSelector value={tags} onChange={setTags} />
    </div>
  );
}
