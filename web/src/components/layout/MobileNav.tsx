"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { collections, navLinks } from "@/lib/content";
import { menuTransition } from "@/lib/motion";

/**
 * Mobiele navigatie: hamburger die een plat, gestapeld menu opent
 * over de volledige viewport (Deep Wine vlak, witte links).
 */
export function MobileNav({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`relative z-50 flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[7px] ${
          open ? "text-white" : solid ? "text-wine" : "text-white"
        }`}
      >
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${
            open ? "translate-y-[4px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ${
            open ? "-translate-y-[4px] -rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={menuTransition}
            className="fixed inset-0 z-40 flex flex-col bg-wine px-8 pt-[72px] pb-10 text-white antialiased"
          >
            <Image
              src="/logo/logo-horizontal-white.png"
              alt="Veramiek"
              width={520}
              height={130}
              className="mt-4 h-9 w-auto self-start"
            />
            <nav
              aria-label="Mobiele navigatie"
              className="mt-10 flex flex-col gap-6 overflow-y-auto"
            >
              {navLinks.map((link) =>
                link.label === "Collecties" ? (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-2xl tracking-[0.08em]"
                    >
                      Collecties
                    </Link>
                    <ul className="mt-3 ml-5 space-y-2">
                      {collections.map((collection) => (
                        <li key={collection.name}>
                          <Link
                            href={collection.href}
                            onClick={() => setOpen(false)}
                            className="text-base opacity-80"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl tracking-[0.08em]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
