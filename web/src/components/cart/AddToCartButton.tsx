"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./CartDrawer";
import { isOpAanvraag, type Product } from "@/lib/api";

/**
 * Aantal-stepper + "In winkelwagen"-knop op de productpagina. Voegt het
 * gekozen aantal toe en opent daarna de cart-drawer (via CartProvider.add).
 *
 * Ligt er niets meer, dan verdwijnt de knop en komt er een aanvraag voor in de
 * plaats. Alles is met de hand gemaakt, dus uitverkocht betekent hier "opnieuw
 * te maken" en niet "weg". Wel eerlijk zijn dat het dan even duurt.
 */
export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (isOpAanvraag(product)) {
    return (
      <div>
        <p className="text-lg text-white/90">
          Dit stuk is op dit moment uitverkocht.
        </p>
        <p className="mt-2 max-w-[46ch] text-base opacity-70">
          Vera maakt alles met de hand, dus ze kan er een voor je maken. Laat
          weten dat je hem wil, dan hoor je van haar hoelang dat ongeveer duurt.
        </p>
        <Link
          href={`/contact?over=${encodeURIComponent(product.name)}`}
          className="mt-6 inline-flex items-center rounded-full bg-white px-10 py-4 text-lg tracking-[0.03em] whitespace-nowrap text-wine transition-opacity duration-300 hover:opacity-85 active:scale-[0.98]"
        >
          Vraag dit stuk aan
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QtyStepper
        qty={qty}
        onChange={(q) => setQty(Math.max(1, q))}
        label={product.name}
        tone="light"
      />
      <button
        type="button"
        onClick={() => add(product, qty)}
        className="inline-flex cursor-pointer items-center rounded-full bg-white px-10 py-4 text-lg tracking-[0.03em] whitespace-nowrap text-wine transition-opacity duration-300 hover:opacity-85 active:scale-[0.98]"
      >
        In winkelwagen
      </button>
    </div>
  );
}
