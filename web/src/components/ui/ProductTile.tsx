import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/api";

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
}: {
  product: Product;
  aspectClass?: string;
}) {
  const image = product.images[0] ?? null;

  return (
    <Link
      href={`/collecties/${product.id}`}
      className="group/tile block"
    >
      <div className={`relative overflow-hidden bg-sage/10 ${aspectClass}`}>
        {image ? (
          <Image
            src={image}
            alt={product.name}
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

        <span className="absolute bottom-4 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 truncate bg-white/90 px-5 py-1.5 text-sm tracking-[0.06em] text-wine transition-colors duration-300 group-hover/tile:bg-wine group-hover/tile:text-white">
          {product.name}
        </span>
      </div>
      <p className="mt-3 text-base tracking-[0.03em] opacity-80">
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}
