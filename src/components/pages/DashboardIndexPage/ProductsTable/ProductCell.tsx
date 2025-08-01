import { Products } from "@/query/products/types";
import Image from "next/image";

interface ProductCellProps {
  product: Products.Product;
}

export function ProductCell({ product }: ProductCellProps) {
  return (
    <div className="flex items-center gap-4 p-2">
      <div className="w-12 h-[72px]">
        <Image
          width={48}
          height={72}
          src={product.medias[0].url}
          alt={product.name}
          className="object-cover rounded shrink-0 w-12 h-[72px]"
        />
      </div>

      <div className="flex-1">
        <h2 className="font-bold text-md">{product.name}</h2>
        <p className="text-card-foreground/80 text-sm mb-1 overflow-hidden overflow-ellipsis line-clamp-2">
          {product.description}
        </p>
      </div>
    </div>
  );
}
