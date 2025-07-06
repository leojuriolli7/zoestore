/* eslint-disable @next/next/no-img-element */
import { Products } from "@/query/products/types";

interface ProductCardProps {
  product: Products.Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex items-center gap-4 p-2">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-12 h-12 object-cover rounded shrink-0"
      />
      <div className="flex-1">
        <h2 className="font-bold text-md">{product.name}</h2>
        <p className="text-card-foreground/80 text-sm mb-1 overflow-hidden overflow-ellipsis line-clamp-2">
          {product.description}
        </p>
      </div>
    </div>
  );
}
