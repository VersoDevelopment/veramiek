"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MorphName } from "@/components/ui/MorphName";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { collections } from "@/lib/content";

/**
 * Preview-only kopie van de Collecties-accordion: naam staat niet meer op de
 * foto, alleen nog als navigatie-label op de smalle, niet-actieve stroken.
 * Niet gekoppeld aan de productiesite, puur om te reviewen.
 */
function PreviewAccordion({
  activeIndex,
  onActiveIndexChange,
}: {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}) {
  const rowCollections = collections.slice(0, 3);

  return (
    <div className="group/gallery mx-auto flex h-[340px] w-[1500px] max-w-[calc(100vw-3rem)] gap-[2px] md:h-[500px]">
      {rowCollections.map((collection, index) => {
        const isActive = index === activeIndex;
        return (
          <Link
            key={collection.name}
            href={collection.href}
            onClick={(event) => {
              if (!isActive) {
                event.preventDefault();
                onActiveIndexChange(index);
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
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              style={{ objectPosition: collection.accordionObjectPosition }}
              className="object-cover transition-transform duration-700 ease-out group-hover/panel:scale-[1.02]"
            />
            {!isActive && (
              <span className="absolute bottom-5 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 truncate bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] text-wine [writing-mode:vertical-rl]">
                {collection.name}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm tracking-[0.04em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
                Bekijk collectie &rarr;
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function CollectiesMorphPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCollection = collections[activeIndex];

  return (
    <>
      <RevealSection
        id="collecties-preview"
        stagger
        className="relative z-10 bg-white pt-14 pb-16 md:pt-16 md:pb-20"
      >
        <RevealItem>
          <h2 className="mb-8 text-center text-2xl md:mb-10 md:text-3xl">Collecties</h2>
        </RevealItem>
        <RevealItem>
          <PreviewAccordion activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
        </RevealItem>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <MorphName
            text={activeCollection.name}
            className="translate-y-[15%] font-display text-6xl font-black tracking-[0.05em] text-wine md:text-7xl"
          />
        </div>
      </RevealSection>

      <div className="bg-wine pt-20 md:pt-28">
        <BlogTeaser />
      </div>
    </>
  );
}
