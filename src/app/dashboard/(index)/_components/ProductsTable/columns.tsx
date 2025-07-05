"use client";

import { Badge } from "@/components/ui/badge";
import { Products } from "@/query/products/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ProductCard } from "./ProductCard";

import { Button } from "@/components/ui/button";
import { EditIcon, Trash2 } from "lucide-react";
import { useUpertProductStore } from "../UpsertProductDialog/store";
import { useDeleteProductDialogStore } from "../DeleteProductDialog/store";
import { useCallback } from "react";

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
    const blob = await urlToBlob(product.image_url);

    const file = new File([blob], "product_image", {
      type: blob.type || "image/jpeg",
    });

    setUpsertProductOpen(true, { ...product, imageFile: file });
  }, [product, setUpsertProductOpen]);

  const openDeleteModal = useCallback(() => {
    setDeleteProductOpen(true, product);
  }, [product, setDeleteProductOpen]);

  return (
    <div className="flex gap-2 items-center justify-center">
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
    accessorKey: "name",
    header: "Produto",
    cell: ({ row }) => <ProductCard product={row.original} />,
  },
  {
    accessorKey: "tags",
    header: "Categorias",
    cell: ({ row }) => {
      const tags = row.original.tags;

      if (!tags) return <p>Nenhuma</p>;

      return (
        <div className="flex gap-2 items-center">
          {tags.map((tag, index) => (
            <Badge
              variant={index % 2 === 0 ? "default" : "secondary"}
              key={tag.id}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      );
    },
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
