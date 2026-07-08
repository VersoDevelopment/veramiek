"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Collection } from "@/lib/content";

/** Hoe lang (ms) elke foto zichtbaar blijft voor de tegel doorwisselt. */
const CYCLE_INTERVAL_MS = 3200;

/**
 * Tegel voor de collectierij: staand beeld met een licht naamchip,
 * gecentreerd onderaan. Bij hover van déze tegel (group/tile) kleurt de
 * naam naar het sage-accent en zoomt het beeld subtiel. Zodra de cursor
 * ergens boven de hele rij (group/gallery, zie Collecties.tsx) is, licht
 * een wine-wit-wine lichtvlek op die de cursor volgt en gewoon doorloopt
 * over de naad met de buurtegel (zie `data-glow-spot` in globals.css).
 * De lichtvlek zit als volle laag ACHTER de foto; de foto zelf ligt 3px
 * ingesprongen erboven, zodat alleen een dun randje van de gloed
 * zichtbaar wordt (geen CSS mask nodig, bleek onbetrouwbaar in tests).
 * Bij meerdere foto's (collection.images.length > 1) wisselt de tegel er
 * vanzelf tussen met een crossfade; met één foto blijft het statisch.
 */
export function CollectionTile({ collection }: { collection: Collection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = collection.images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % collection.images.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasMultiple, collection.images.length]);

  return (
    <Link
      href={collection.href}
      className="group/tile relative block aspect-[3/4] overflow-hidden"
    >
      <div
        aria-hidden
        data-glow-spot
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/gallery:opacity-100 motion-reduce:hidden"
      />
      <div className="absolute inset-[3px] overflow-hidden">
        {collection.images.map((image, i) => (
          <Image
            key={image}
            src={image}
            alt={collection.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={`object-cover transition-[opacity,transform] duration-700 ease-out group-hover/tile:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/tile:scale-100 ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] whitespace-nowrap text-wine transition-colors duration-300 group-hover/tile:bg-wine group-hover/tile:text-white">
        {collection.name}
      </span>
    </Link>
  );
}
