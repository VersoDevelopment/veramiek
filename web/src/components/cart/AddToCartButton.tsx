"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./CartDrawer";
import type { Product } from "@/lib/api";

/**
 * Aantal-stepper + "In winkelwagen"-knop op de productpagina. Voegt het
 * gekozen aantal toe en opent daarna de cart-drawer (via CartProvider.add).
 */
export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

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
