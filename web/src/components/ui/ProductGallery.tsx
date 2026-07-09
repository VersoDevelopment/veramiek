"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Productfoto's: één groot beeld met, bij meerdere foto's, een rij
 * miniaturen eronder om te wisselen. Vlak, geen schaduw (Flat Gallery Rule).
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-sage/10 text-base opacity-70">
        Foto volgt
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-sage/10">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Foto ${i + 1} bekijken`}
              aria-current={i === active}
              className={`relative h-20 w-16 shrink-0 overflow-hidden bg-sage/10 transition-opacity ${
                i === active ? "opacity-100" : "opacity-55 hover:opacity-85"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
              {i === active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-wine"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
