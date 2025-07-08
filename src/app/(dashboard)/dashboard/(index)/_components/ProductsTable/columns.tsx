"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useCallback } from "react";
import { Products } from "@/query/products/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRightFromSquareIcon, EditIcon, Trash2 } from "lucide-react";
import { useUpertProductStore } from "../UpsertProductDialog/store";
import { useDeleteProductDialogStore } from "../DeleteProductDialog/store";
import { ProductCell } from "./ProductCell";
import { TagsCell } from "./TagsCell";

async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}

const Actions = ({ row }: { row: Row<Products.Product> }) => {
  const product = row.original;

  const setUpsertProductOpen = useUpertProductStore((s) => s.setOpen);
  const setDeleteProductOpen = useDeleteProductDialogStore((s) => s.setOpen);

  const openUpsertProductModal = useCallback(async () => {
    try {
      const blob = await urlToBlob(product.image_url);

      const file = new File([blob], "product_image", {
        type: blob.type || "image/jpeg",
      });

      setUpsertProductOpen(true, { ...product, imageFile: file });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao tentar editar produto:");
    }
  }, [product, setUpsertProductOpen]);

  const openDeleteModal = useCallback(() => {
    setDeleteProductOpen(true, product);
  }, [product, setDeleteProductOpen]);

  return (
    <div className="flex gap-2 items-center justify-center pr-2">
      <Link href={`/products/${product.slug}`} target="_blank" prefetch={false}>
        <Button size="icon" variant="outline">
          <ArrowUpRightFromSquareIcon />
        </Button>
      </Link>

      <Button size="icon" variant="secondary" onClick={openUpsertProductModal}>
        <EditIcon />
      </Button>

      <Button size="icon" variant="destructive" onClick={openDeleteModal}>
        <Trash2 />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Products.Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="ml-3 flex align-center justify-start">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="ml-3 flex align-center justify-start">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Produto",
    cell: ({ row }) => <ProductCell product={row.original} />,
  },
  {
    accessorKey: "tags",
    header: "Categorias",
    cell: TagsCell,
  },
  {
    accessorKey: "price",
    header: () => <p className="text-right">Preço</p>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: Actions,
  },
];
