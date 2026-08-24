"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { maxAantal, useCart } from "./CartProvider";
import { formatPrice } from "@/lib/api";
import { menuTransition } from "@/lib/motion";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Cart-drawer die vanaf rechts inschuift. Zelfde rustige galeriestijl als de
 * rest van de site: wit vlak, Deep Wine tekst, geen schaduw. Opent bij het
 * toevoegen van een product of via het wagentje in de nav.
 */
export function CartDrawer() {
  const { items, total, count, setQty, remove, isOpen, close } = useCart();
  const prefersReduced = usePrefersReducedMotion();
  const panelRef = useDialogFocus<HTMLElement>(isOpen, close);

  const panelInitial = prefersReduced ? { opacity: 0 } : { x: "100%" };
  const panelAnimate = prefersReduced ? { opacity: 1 } : { x: 0 };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={menuTransition}
        >
          {/* Overlay */}
          <button
            type="button"
            aria-label="Winkelwagen sluiten"
            onClick={close}
            className="absolute inset-0 bg-wine/30 backdrop-blur-[2px]"
          />

          {/* Paneel */}
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-label="Winkelwagen"
            aria-modal="true"
            tabIndex={-1}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-white text-wine"
          >
            <header className="flex items-center justify-between border-b border-sage/40 px-7 py-6">
              <h2 className="font-display text-2xl tracking-[0.08em]">
                Winkelwagen
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Sluiten"
                className="cursor-pointer p-1 opacity-70 transition-opacity hover:opacity-100"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
                <p className="text-base opacity-75">
                  Je winkelwagen is nog leeg.
                </p>
                <Link
                  href="/collecties"
                  onClick={close}
                  className="mt-6 text-base tracking-[0.03em] underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Bekijk de collecties
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-sage/30 overflow-y-auto px-7">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-6">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sage/10">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-display text-lg leading-tight tracking-[0.04em]">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            aria-label={`${item.name} verwijderen`}
                            className="cursor-pointer text-sm underline decoration-1 underline-offset-2 opacity-60 transition-opacity hover:opacity-100"
                          >
                            Verwijder
                          </button>
                        </div>
                        <p className="mt-1 text-base opacity-75">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-auto flex items-center gap-3 pt-3">
                          <QtyStepper
                            qty={item.qty}
                            onChange={(q) => setQty(item.id, q)}
                            label={item.name}
                            max={maxAantal(item.stock)}
                          />
                          <span className="ml-auto text-base">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-sage/40 px-7 py-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="opacity-75">Totaal</span>
                    <span className="font-display tracking-[0.04em]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <Link
                    href="/winkelwagen"
                    onClick={close}
                    className="mt-6 block w-full rounded-full bg-wine px-8 py-3 text-center text-base tracking-[0.03em] text-white transition-opacity hover:opacity-85"
                  >
                    Naar bestellen ({count})
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Kleine plus/min-stepper voor het aantal, gedeeld met de cart-pagina.
 * `tone="light"` voor gebruik op een wijnrood vlak (witte rand/hover),
 * standaard `dark` voor witte adempauze-vlakken (wine rand/hover).
 */
export function QtyStepper({
  qty,
  onChange,
  label,
  tone = "dark",
  max = Infinity,
}: {
  qty: number;
  onChange: (qty: number) => void;
  label: string;
  tone?: "dark" | "light";
  /** Hoogste aantal dat besteld kan worden; standaard geen grens. */
  max?: number;
}) {
  const border = tone === "light" ? "border-white/30" : "border-wine/25";
  const hover =
    tone === "light"
      ? "hover:bg-white hover:text-wine"
      : "hover:bg-wine hover:text-white";
  return (
    <div className={`inline-flex items-center border ${border}`}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label={`Minder ${label}`}
        className={`inline-flex cursor-pointer items-center justify-center p-3.5 transition-colors ${hover}`}
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <span
        aria-live="polite"
        className="min-w-[2.5rem] text-center text-base tabular-nums"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(qty + 1, max))}
        disabled={qty >= max}
        aria-label={`Meer ${label}`}
        className={`inline-flex cursor-pointer items-center justify-center p-3.5 transition-colors ${hover} disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent`}
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
