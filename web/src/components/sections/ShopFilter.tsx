"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductTile } from "@/components/ui/ProductTile";
import {
  normalizeCategory,
  SHOP_CATEGORIES,
  type Product,
  type ShopCategory,
} from "@/lib/api";
import { fadeUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Filter = "Alles" | ShopCategory;

/**
 * Bewust ongelijk raster: een herhalend ritme van twee grotere en drie
 * kleinere tegels (per rij van 6 kolommen), zodat de winkel als een galerie
 * oogt en niet als een uniform kaartgrid (DESIGN.md-regel).
 */
const SPAN_RHYTHM = [
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];
const ASPECT_RHYTHM = [
  "aspect-[5/6]",
  "aspect-[5/6]",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-[3/4]",
];

export function ShopFilter({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  // Alleen categorieën tonen die daadwerkelijk producten hebben.
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((p) => normalizeCategory(p.category)));
    return SHOP_CATEGORIES.filter((c) => present.has(c));
  }, [products]);

  const normalizedInitial = initialCategory
    ? normalizeCategory(initialCategory)
    : null;
  const [active, setActive] = useState<Filter>(
    normalizedInitial && availableCategories.includes(normalizedInitial)
      ? normalizedInitial
      : "Alles",
  );

  const filtered = useMemo(
    () =>
      active === "Alles"
        ? products
        : products.filter((p) => normalizeCategory(p.category) === active),
    [products, active],
  );

  const filters: Filter[] = ["Alles", ...availableCategories];

  return (
    <div>
      {/* Filter-chips */}
      {availableCategories.length > 0 && (
        <div
          role="tablist"
          aria-label="Filter op soort"
          className="mb-12 flex flex-wrap justify-center gap-x-3 gap-y-3 md:mb-16"
        >
          {filters.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter)}
                className={`cursor-pointer rounded-full border px-5 py-2 text-base tracking-[0.03em] transition-colors duration-300 ${
                  isActive
                    ? "border-wine bg-wine text-white"
                    : "border-wine/25 text-wine hover:border-wine"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-base opacity-70">
          Er zijn nog geen stukken in deze categorie. Kom snel terug.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-6 md:gap-x-6 md:gap-y-14">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const span = SPAN_RHYTHM[i % SPAN_RHYTHM.length];
              const aspect = ASPECT_RHYTHM[i % ASPECT_RHYTHM.length];
              return (
                <motion.div
                  key={product.id}
                  layout={!prefersReduced}
                  variants={prefersReduced ? undefined : fadeUp}
                  initial={prefersReduced ? false : "hidden"}
                  animate="visible"
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  className={span}
                >
                  <ProductTile product={product} aspectClass={aspect} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
