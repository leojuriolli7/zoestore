"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Products } from "@/query/products/types";
import { unstable_ViewTransition as ViewTransition } from "react";

interface ProductImageSliderProps {
  images: Array<Products.Media>;
  productName: string;
  productId: number;
}

export function ProductImageSlider({
  images,
  productName,
  productId,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-[2/3] flex items-center justify-center bg-muted text-muted-foreground rounded-lg">
        Imagem não disponível
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md">
        <ViewTransition name={`product-${productId}`}>
          <Image
            priority
            fetchPriority="high"
            src={images[0].url}
            alt={productName}
            fill
            className="object-cover w-full h-full"
          />
        </ViewTransition>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group">
        <ViewTransition name={`product-${productId}`}>
          <Image
            priority
            fetchPriority="high"
            src={images[currentIndex].url}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            fill
            className="object-cover w-full h-full"
          />
        </ViewTransition>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transition-all -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100"
          onClick={goToPrevious}
        >
          <span className="sr-only">Imagem anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transition-all -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100"
          onClick={goToNext}
        >
          <span className="sr-only">Próxima imagem</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => goToSlide(index)}
            data-active={index === currentIndex}
            className={cn(
              "cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
              "data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20",
              "data-[active=false]:border-border/50 hover:data-[active=false]:border-primary/50 data-[active=false]:opacity-80"
            )}
          >
            <Image
              src={image.url}
              alt={`${productName} - Miniatura ${index + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full object-top"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
