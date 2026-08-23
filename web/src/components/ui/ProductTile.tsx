import Image from "next/image";
import Link from "next/link";
import { formatPrice, isOpAanvraag, type Product } from "@/lib/api";

/**
 * Producttegel in galeriestijl (zelfde taal als CollectionTile): staand
 * beeld met een subtiele zoom bij hover, een licht naam-chip onderaan en de
 * prijs eronder. Optionele badge linksboven. De tegelgrootte/verhouding komt
 * van buiten (aspectClass), zodat de winkel een bewust ongelijk raster heeft
 * in plaats van vier identieke vakken.
 */
export function ProductTile({
  product,
  aspectClass = "aspect-[3/4]",
  label,
}: {
  product: Product;
  aspectClass?: string;
  /**
   * Onderscheidende naam, bv. "Chip & Dip Bowl, Zeeuws Zand". Zes productnamen
   * komen meerdere keren voor; zonder dit staan er drie tegels met exact
   * dezelfde tekst en dezelfde alt-tekst onder elkaar. Valt terug op de kale
   * productnaam waar dat niet speelt.
   */
  label?: string;
}) {
  const image = product.images[0] ?? null;
  const naam = label ?? product.name;

  return (
    <Link
      href={`/collecties/${product.id}`}
      className="group/tile block"
    >
      <div className={`relative overflow-hidden bg-sage/10 ${aspectClass}`}>
        {image ? (
          <Image
            src={image}
            alt={naam}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/tile:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/tile:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-base opacity-70">
            Foto volgt
          </div>
        )}

        {product.badge && (
          <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-sm tracking-[0.06em] text-wine">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-4 left-1/2 hidden max-w-[calc(100%-2rem)] -translate-x-1/2 truncate bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] text-wine transition-colors duration-300 group-hover/tile:bg-wine group-hover/tile:text-white md:block">
          {naam}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-base tracking-[0.03em] opacity-85 md:block">
        <p className="min-w-0 truncate md:hidden">{naam}</p>
        <p className="shrink-0 md:mt-3">
          {formatPrice(product.price)}
          {/* Zonder dit klikt iemand door op een prijs en ontdekt hij pas op de
              productpagina dat het stuk er niet ligt. */}
          {isOpAanvraag(product) && (
            <span className="ml-2 whitespace-nowrap opacity-60">op aanvraag</span>
          )}
        </p>
      </div>
    </Link>
  );
}
