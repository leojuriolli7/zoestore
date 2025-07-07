import Image from "next/image";
import { useState, useEffect } from "react";

const carouselImages = [
  "/left_desktop.jpg",
  "/center_both.jpg",
  "/right_desktop.jpg",
];

function SliderOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white px-4 w-full">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-shadow-sm text-shadow-black">
          Peças que vestem elegância
        </h2>
        <p className="text-lg md:text-xl mb-6 opacity-90 text-shadow-xs text-shadow-black">
          Descubra nossa coleção exclusiva
        </p>
      </div>
    </div>
  );
}

export function HomepageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    if (!mediaQuery.matches) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[2/3] md:aspect-[2/1] md:max-h-[600px] overflow-hidden">
      {/* Mobile carousel */}
      <div className="block md:hidden h-full w-full">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{
            width: `${carouselImages.length * 100}%`,
            transform: `translateX(-${
              current * (100 / carouselImages.length)
            }%)`,
          }}
        >
          {carouselImages.map((img, index) => (
            <div
              key={img}
              className="relative w-full h-full flex-shrink-0"
              style={{ width: `calc(100% / ${carouselImages.length})` }}
            >
              <Image
                src={img}
                alt="ZOE STORE - Elegant Fashion"
                fill
                className="object-cover select-none object-top"
                priority
                fetchPriority={index === 0 ? "high" : undefined}
                loading="eager"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <SliderOverlay />
      </div>

      {/* Desktop: 3 images side by side */}
      <div className="hidden md:flex h-full w-full">
        {carouselImages.map((img) => (
          <div key={img} className="relative h-full flex-1">
            <Image
              src={img}
              alt="ZOE STORE - Elegant Fashion"
              fill
              priority
              className="object-cover select-none object-top"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none">
          <SliderOverlay />
        </div>
      </div>
    </div>
  );
}
