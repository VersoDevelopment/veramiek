"use client";

import Image from "next/image";
import { formatPrice, type Product } from "@/lib/api";
import { Knop } from "./Veld";

type Props = {
  producten: Product[];
  bezigId: string | null;
  onBewerk: (product: Product) => void;
  onVerwijder: (product: Product) => void;
};

/** Toont de voorraad, of dat er nooit een aantal is ingevuld. */
function voorraadTekst(product: Product): string {
  if (product.stock == null) return "niet geteld";
  if (product.stock === 0) return "op";
  return `${product.stock} op voorraad`;
}

export function ProductList({ producten, bezigId, onBewerk, onVerwijder }: Props) {
  if (producten.length === 0) {
    return (
      <p className="py-10 text-[0.95rem] text-wine/60">
        Er staan nog geen producten in de webshop.
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-lg border border-wine/12 bg-white">
      {producten.map((product) => (
        <li
          key={product.id}
          className="flex items-center gap-4 border-b border-wine/8 px-4 py-3 last:border-b-0"
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt=""
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 shrink-0 rounded object-cover"
            />
          ) : (
            <div className="h-12 w-12 shrink-0 rounded bg-wine/8" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.95rem] text-wine">{product.name}</p>
            <p className="text-[0.85rem] text-wine/50">
              {formatPrice(product.price)} &middot; {voorraadTekst(product)}
              {product.available === false && " · verborgen"}
            </p>
          </div>

          <Knop type="button" onClick={() => onBewerk(product)}>
            Bewerk
          </Knop>
          <Knop
            type="button"
            onClick={() => onVerwijder(product)}
            disabled={bezigId === product.id}
          >
            {bezigId === product.id ? "Bezig..." : "Verwijder"}
          </Knop>
        </li>
      ))}
    </ul>
  );
}
