/* eslint-disable @next/next/no-img-element */
import { Products } from "@/query/products/types";

interface ProductCellProps {
  product: Products.Product;
}

export function ProductCell({ product }: ProductCellProps) {
  return (
    <div className="flex items-center gap-4 p-2">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-12 aspect-[2/3] object-cover rounded shrink-0"
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
