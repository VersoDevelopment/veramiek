"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Collection } from "@/lib/content";

/**
 * Collectierij als accordion: de actieve tegel neemt het grootste deel van
 * de breedte in, de andere twee blijven als smalle stroken zichtbaar (naam
 * verticaal). Klik op een smalle strook wisselt de actieve tegel; klik op de
 * al-actieve tegel navigeert naar de collectiepagina. Zelfde 2px-naad en
 * naamchip-stijl als de vorige statische Collectiewand.
 */
export function CollectionAccordion({ collections }: { collections: Collection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="group/gallery mx-auto flex h-[520px] w-[1869px] max-w-[calc(100vw-3rem)] gap-[2px] md:h-[880px]">
      {collections.map((collection, index) => {
        const isActive = index === activeIndex;
        return (
          <Link
            key={collection.name}
            href={collection.href}
            onClick={(event) => {
              if (!isActive) {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
            aria-current={isActive ? "true" : undefined}
            className={`group/panel relative min-w-16 overflow-hidden transition-[flex-grow] duration-700 ease-out ${
              isActive ? "flex-[7_1_0%]" : "flex-[1_1_0%]"
            }`}
          >
            <Image
              src={collection.accordionImage}
              alt={collection.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              style={{ objectPosition: collection.accordionObjectPosition }}
              className="object-cover transition-transform duration-700 ease-out group-hover/panel:scale-[1.02]"
            />
            <span
              className={`absolute bottom-5 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 truncate bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] text-wine ${
                isActive ? "" : "[writing-mode:vertical-rl]"
              }`}
            >
              {collection.name}
            </span>
            {isActive && (
              <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-sm tracking-[0.04em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
                Bekijk collectie &rarr;
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
