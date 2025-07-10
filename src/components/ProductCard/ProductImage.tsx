"use client";

import { cn } from "@/lib/utils";
import type { Products } from "@/query/products/types";
import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  medias,
  name,
}: {
  medias: Products.Product["medias"];
  name: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const firstImage = medias[0].url;
  const secondImage = medias.length > 1 ? medias[1].url : null;

  return (
    <div
      className="relative overflow-hidden rounded-t-lg aspect-[2/3] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        fill
        priority
        src={firstImage}
        alt={name}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "absolute inset-0 object-cover rounded-md select-none",
          "transition-all duration-500 ease-in-out",
          {
            "opacity-0 scale-[102%]": isHovered,
            "opacity-100 scale-100": !isHovered,
          }
        )}
      />

      {secondImage && (
        <Image
          fill
          src={secondImage}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "absolute inset-0 object-cover rounded-md select-none",
            "transition-all duration-500 ease-in-out",
            {
              "opacity-100 scale-[102%]": isHovered,
              "opacity-0 scale-100": !isHovered,
            }
          )}
        />
      )}
    </div>
  );
}
