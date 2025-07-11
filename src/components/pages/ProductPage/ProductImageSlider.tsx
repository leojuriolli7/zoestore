import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Products } from "@/query/products/types";
import { useRef, unstable_ViewTransition as ViewTransition } from "react";

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
  const carouselRef = useRef<HTMLDivElement>(null);

  /**
   * When the user clicks on the arrow buttons, this function finds the currently visible image
   * and scrolls to the next or previous image in the carousel.
   *
   * It uses the `getBoundingClientRect` method to determine visibility and scrolls smoothly
   * to the next or previous image based on the direction specified.
   */
  const onClickArrow = (direction: "back" | "next") => () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselRect = carousel.getBoundingClientRect();

    images.some((_, index) => {
      const element = document.getElementById(`slide-${index}`);
      if (!element) return false;

      const rect = element.getBoundingClientRect();

      const isVisible =
        rect.left >= carouselRect.left - 1 &&
        rect.right <= carouselRect.right + 1;

      if (isVisible) {
        const delta = direction === "next" ? 1 : -1;
        const nextIndex = (index + delta + images.length) % images.length;

        const nextElement = document.getElementById(`slide-${nextIndex}`);

        if (nextElement) {
          nextElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }

        return true;
      }
    });
  };

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

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md group">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full scrollbar-hide"
          ref={carouselRef}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              id={`slide-${index}`}
              className="relative flex-shrink-0 w-full h-full snap-start"
            >
              <ViewTransition name={`product-${productId}`}>
                <Image
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  src={image.url}
                  alt={`${productName} - Imagem ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                />
              </ViewTransition>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <button
            onClick={onClickArrow("back")}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-md transition-colors pointer-events-auto z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={onClickArrow("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-md transition-colors pointer-events-auto z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={(e) => {
              e.preventDefault();

              const productImage = document.getElementById(`slide-${index}`);
              if (productImage) {
                productImage.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }
            }}
            className="cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 border-border/50 hover:border-primary/50 opacity-80 transition-all"
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
