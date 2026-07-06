"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { collections, productCategories } from "@/lib/content";
import { menuTransition } from "@/lib/motion";

/**
 * Collecties-megamenu in twee stappen: het paneel toont eerst alleen de
 * collectienamen; pas bij hover of focus op een naam klapt links daarvan
 * de kolom met productsoorten uit. Het paneel hangt aan de rechterkant
 * van de nav, dus de tweede kolom groeit naar links en de namen blijven
 * op hun plek. Snelle animatie (~180ms), dit is een UI-affordance.
 */
export function NavMegaMenu({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  useEffect(() => {
    if (!open) setActiveCollection(null);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelClose();
    };
  }, [cancelClose]);

  return (
    <div
      ref={wrapperRef}
      className="flex h-full items-center"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        className="cursor-pointer text-base tracking-[0.03em] opacity-85 transition-opacity hover:opacity-100"
      >
        Collecties
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={menuTransition}
            className="absolute top-full right-5 left-auto flex flex-row-reverse border border-wine/10 bg-white text-wine md:right-10"
          >
            <div className="w-60 p-9">
              <p className="mb-4 font-display text-lg tracking-[0.08em]">
                Collecties
              </p>
              <ul className="space-y-3">
                {collections.map((collection) => (
                  <li key={collection.name}>
                    <Link
                      href={collection.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveCollection(collection.name)}
                      onFocus={() => setActiveCollection(collection.name)}
                      className={`transition-opacity ${
                        activeCollection === collection.name
                          ? "opacity-100"
                          : "opacity-80 hover:opacity-100"
                      } text-base`}
                    >
                      {collection.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <AnimatePresence>
              {activeCollection && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={menuTransition}
                  className="w-60 border-r border-sage/40 p-9"
                >
                  <p className="mb-4 font-display text-lg tracking-[0.08em]">
                    Per soort
                  </p>
                  <ul className="space-y-2.5">
                    {productCategories.map((category) => (
                      <li key={category.label}>
                        <Link
                          href={category.href}
                          onClick={() => setOpen(false)}
                          className="text-base opacity-80 transition-opacity hover:opacity-100"
                        >
                          {category.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
