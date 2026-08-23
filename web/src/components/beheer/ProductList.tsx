"use client";

import Image from "next/image";
import { formatPrice, type Product } from "@/lib/api";

type Props = {
  producten: Product[];
  bezigId: string | null;
  onBewerk: (product: Product) => void;
  onVerwijder: (product: Product) => void;
};

/** Toont de voorraad, of een streepje als er nooit een aantal is ingevuld. */
function voorraadTekst(product: Product): string {
  if (product.stock == null) return "niet geteld";
  if (product.stock === 0) return "op";
  return `${product.stock} op voorraad`;
}

export function ProductList({ producten, bezigId, onBewerk, onVerwijder }: Props) {
  if (producten.length === 0) {
    return (
      <p className="py-10 text-base text-wine/70">
        Er staan nog geen producten in de webshop.
      </p>
    );
  }

  return (
    <ul>
      {producten.map((product) => (
        <li
          key={product.id}
          className="flex items-center gap-4 border-b border-wine/10 py-4"
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded bg-wine/10" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-base text-wine">{product.name}</p>
            <p className="text-sm text-wine/60">
              {formatPrice(product.price)} &middot; {voorraadTekst(product)}
              {product.available === false && " · verborgen"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBewerk(product)}
            className="cursor-pointer text-base text-wine underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            Bewerk
          </button>
          <button
            type="button"
            onClick={() => onVerwijder(product)}
            disabled={bezigId === product.id}
            className="cursor-pointer text-base text-wine/60 transition-opacity hover:opacity-100 disabled:opacity-40"
          >
            {bezigId === product.id ? "Bezig..." : "Verwijder"}
          </button>
        </li>
      ))}
    </ul>
  );
}
