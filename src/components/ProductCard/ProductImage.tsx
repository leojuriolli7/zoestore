"use client";

import { cn } from "@/lib/utils";
import type { Products } from "@/query/products/types";
import Image from "next/image";

export function ProductImage({
  medias,
  name,
}: {
  medias: Products.Product["medias"];
  name: string;
}) {
  const firstImage = medias[0];
  const secondImage = medias.length > 1 ? medias[1] : null;

  return (
    <div className="relative overflow-hidden rounded-t-lg aspect-[2/3] w-full">
      <Image
        fill
        priority
        src={firstImage.url}
        alt={name}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "absolute inset-0 object-cover rounded-md select-none",
          "transition-all duration-600 ease-in-out",
          {
            "hover:opacity-0 hover:scale-[102%]": secondImage,
          }
        )}
      />

      {secondImage && (
        <Image
          fill
          src={secondImage.url}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "absolute inset-0 object-cover rounded-md select-none",
            "transition-all duration-600 ease-in-out",
            "hover:opacity-100 hover: scale-[102%] opacity-0 scale-100"
          )}
        />
      )}
    </div>
  );
}
