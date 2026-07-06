import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/content";

/**
 * Tegel voor de collectiewand: randloos beeld met een licht naamchip,
 * gecentreerd onderaan (Deep Wine tekst op lichte chip).
 */
export function CollectionTile({ collection }: { collection: Collection }) {
  return (
    <Link
      href={collection.href}
      className={`group relative block overflow-hidden ${collection.tileClass}`}
    >
      <Image
        src={collection.image}
        alt={collection.alt}
        fill
        sizes="(min-width: 768px) 58vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] whitespace-nowrap text-wine">
        {collection.name}
      </span>
    </Link>
  );
}
