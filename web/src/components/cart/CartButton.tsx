"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

/**
 * Wagentje voor de nav: opent de cart-drawer en toont een klein
 * item-teller-bolletje zodra er iets in de winkelwagen zit. Erft de
 * tekstkleur van de nav (wit boven de hero, Deep Wine in de solid-stand).
 */
export function CartButton({ className = "" }: { className?: string }) {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        count > 0
          ? `Winkelwagen openen, ${count} ${count === 1 ? "artikel" : "artikelen"}`
          : "Winkelwagen openen"
      }
      className={`relative inline-flex cursor-pointer items-center opacity-85 transition-opacity hover:opacity-100 ${className}`}
    >
      <ShoppingBag size={22} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-wine px-1 text-[0.7rem] leading-none text-white tabular-nums ring-1 ring-white">
          {count}
        </span>
      )}
    </button>
  );
}
