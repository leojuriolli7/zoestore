import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Products } from "@/query/products/types";
import { useRef, unstable_ViewTransition as ViewTransition } from "react";

interface ProductImageSliderProps {
  images: Array<Products.Media>;
  productName: string;
}

export function ProductImageSlider({
  images,
  productName,
}: ProductImageSliderProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  /**
   * Loops through each image and sets the `aria-current` attribute to true
   * or false based on the given index.
   */
  const setActiveThumbnail = (activeIndex: number) => {
    images.forEach((_, i) => {
      const imageThumb = document.getElementById(`thumbnail-${i}`);
      imageThumb?.setAttribute("aria-current", (i === activeIndex).toString());
    });
  };

  /**
   * Calculate index using the scroll position of the carousel and
   * the number of images rendered.
   */
  const getCurrentVisibleIndex = (): number => {
    const carousel = carouselRef.current;
    if (!carousel) return 0;

    const scrollLeft = carousel.scrollLeft;
    const slideWidth = carousel.scrollWidth / images.length;

    return Math.round(scrollLeft / slideWidth);
  };

  const scrollToSlide = (index: number) => {
    const element = document.getElementById(`slide-${index}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

      setActiveThumbnail(index);
    }
  };

  const onScroll = () => {
    setActiveThumbnail(getCurrentVisibleIndex());
  };

  /**
   * When the user clicks on the arrow buttons, this function finds the currently visible image
   * and scrolls to the next or previous image in the carousel.
   */
  const onClickArrow = (direction: "back" | "next") => () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const currentIndex = getCurrentVisibleIndex();
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = (currentIndex + delta + images.length) % images.length;

    scrollToSlide(nextIndex);
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
        <ViewTransition name={`product-image-${images[0].id}`}>
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
          onScroll={onScroll}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              id={`slide-${index}`}
              className="relative flex-shrink-0 w-full h-full snap-start"
            >
              {index === 0 ? (
                <ViewTransition name={`product-image-${image.id}`}>
                  <Image
                    priority={index === 0}
                    fetchPriority={index === 0 ? "high" : "low"}
                    src={image.url}
                    alt={`${productName} - Imagem ${index + 1}`}
                    fill
                    className="object-cover w-full h-full"
                  />
                </ViewTransition>
              ) : (
                <Image
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  src={image.url}
                  alt={`${productName} - Imagem ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                />
              )}
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
            type="button"
            onClick={() => scrollToSlide(index)}
            className="cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 border-border/50 hover:border-primary/50 aria-[current=false]:opacity-80 transition-all aria-[current=true]:border-primary aria-[current=true]:opacity-100"
            id={`thumbnail-${index}`}
            aria-current={index === 0}
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
