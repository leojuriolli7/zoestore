import Image from "next/image";
import { useState, useEffect } from "react";

const carouselImages = [
  "/left_desktop.jpg",
  "/center_both.jpg",
  "/right_desktop.jpg",
];

export function HomepageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[2/3] md:aspect-[5/2] overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${carouselImages.length * 100}%`,
          transform: `translateX(-${current * (100 / carouselImages.length)}%)`,
        }}
      >
        {carouselImages.map((img, idx) => (
          <div
            key={img}
            className="relative w-full h-full flex-shrink-0"
            style={{ width: `calc(100% / ${carouselImages.length})` }}
          >
            <Image
              src={img}
              alt="ZOE STORE - Elegant Fashion"
              fill
              className="object-cover object-top"
              priority={current === idx}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-shadow-sm text-shadow-black">
            Peças que vestem elegância
          </h2>
          <p className="text-lg md:text-xl mb-6 opacity-90 text-shadow-xs text-shadow-black">
            Descubra nossa coleção exclusiva
          </p>
        </div>
      </div>
    </div>
  );
}
