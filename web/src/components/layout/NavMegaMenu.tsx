"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { collections, productCategories } from "@/lib/content";
import { menuTransition } from "@/lib/motion";

/**
 * Collecties-megamenu: opent op hover, klik en focus. Eén paneel met twee
 * kolommen die samen verschijnen: links de collecties, rechts de
 * product-categorieën. Snelle animatie (~180ms), dit is een UI-affordance.
 */
export function NavMegaMenu({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
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
            className={`absolute top-full right-5 left-auto w-[min(40rem,calc(100vw-2.5rem))] border border-wine/10 bg-white p-10 text-wine md:right-10 ${
              solid ? "" : "border-t-white/0"
            }`}
          >
            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="mb-4 font-display text-lg tracking-[0.08em]">
                  Collecties
                </p>
                <ul className="space-y-3">
                  {collections.map((collection) => (
                    <li key={collection.name}>
                      <Link
                        href={collection.href}
                        onClick={() => setOpen(false)}
                        className="text-base opacity-80 transition-opacity hover:opacity-100"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l border-sage/40 pl-10">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
