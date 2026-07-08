"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductTile } from "@/components/ui/ProductTile";
import {
  normalizeCategory,
  productCollections,
  SHOP_CATEGORIES,
  type Product,
  type ShopCategory,
} from "@/lib/api";
import { fadeUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const ALL = "Alles";

/**
 * Bewust ongelijk raster: een herhalend ritme van twee grotere en drie
 * kleinere tegels (per rij van 6 kolommen), zodat de winkel als een galerie
 * oogt en niet als een uniform kaartgrid (DESIGN.md-regel).
 */
const SPAN_RHYTHM = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];
const ASPECT_RHYTHM = [
  "aspect-[5/6]",
  "aspect-[5/6]",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-[3/4]",
];

/** Eén filtergroep in het linkerpaneel: een kop met daaronder de opties. */
function FilterGroup({
  title,
  options,
  active,
  onSelect,
}: {
  title: string;
  options: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-4 font-display text-lg tracking-[0.08em]">{title}</h3>
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5 md:flex-col md:gap-y-3">
        {[ALL, ...options].map((option) => {
          const isActive = option === active;
          return (
            <li key={option}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(option)}
                className={`group relative inline-block text-left text-base tracking-[0.02em] transition-colors ${
                  isActive ? "text-wine" : "text-wine/55 hover:text-wine"
                }`}
              >
                {option}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-sage transition-transform duration-300 ease-out ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ShopFilter({
  products,
  initialCategory,
  initialCollection,
}: {
  products: Product[];
  initialCategory?: string;
  initialCollection?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  // Alleen categorieën / collecties tonen die daadwerkelijk producten hebben.
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((p) => normalizeCategory(p.category)));
    return SHOP_CATEGORIES.filter((c) => present.has(c));
  }, [products]);

  const availableCollections = useMemo(
    () => productCollections(products),
    [products],
  );

  const normalizedCat = initialCategory
    ? normalizeCategory(initialCategory)
    : null;
  const [activeCategory, setActiveCategory] = useState<ShopCategory | "Alles">(
    normalizedCat && availableCategories.includes(normalizedCat)
      ? normalizedCat
      : ALL,
  );
  const [activeCollection, setActiveCollection] = useState<string>(
    initialCollection && availableCollections.includes(initialCollection)
      ? initialCollection
      : ALL,
  );

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const catOk =
          activeCategory === ALL ||
          normalizeCategory(p.category) === activeCategory;
        const colOk =
          activeCollection === ALL ||
          (p.collection ?? "").trim() === activeCollection;
        return catOk && colOk;
      }),
    [products, activeCategory, activeCollection],
  );

  const hasFilters =
    availableCollections.length > 0 || availableCategories.length > 0;

  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-12 lg:gap-16">
      {/* Filterpaneel links */}
      {hasFilters && (
        <aside className="shrink-0 md:sticky md:top-28 md:h-fit md:w-48 lg:w-56">
          <div className="flex flex-col gap-10">
            {availableCollections.length > 0 && (
              <FilterGroup
                title="Collecties"
                options={availableCollections}
                active={activeCollection}
                onSelect={setActiveCollection}
              />
            )}
            {availableCategories.length > 0 && (
              <FilterGroup
                title="Type product"
                options={availableCategories}
                active={activeCategory}
                onSelect={(v) =>
                  setActiveCategory(v as ShopCategory | "Alles")
                }
              />
            )}
          </div>
        </aside>
      )}

      {/* Productraster */}
      <div className="min-w-0 flex-1">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-base opacity-70">
            Er zijn geen stukken die bij deze filters passen.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-14">
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
    </div>
  );
}
