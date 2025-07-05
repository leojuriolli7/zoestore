/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Products } from "@/query/products/types";

interface ProductCardProps {
  product: Products.Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h2 className="font-bold text-lg">{product.name}</h2>
        <p className="text-zinc-500 text-sm mb-1">{product.description}</p>
        <span className="font-semibold text-primary">R$ {product.price}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={() => onEdit(product.id)}>
          Editar
        </Button>

        <Button variant="outline" onClick={() => onDelete(product.id)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
