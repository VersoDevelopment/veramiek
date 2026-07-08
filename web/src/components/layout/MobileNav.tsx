"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { collections, contact, navLinks } from "@/lib/content";
import { menuTransition } from "@/lib/motion";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";

/**
 * Menulink met een sage-onderlijn die bij hover vanaf links inschuift
 * (Whisper Rule: sage alleen als dunne lijn, nooit als vlak).
 */
function MenuLink({
  href,
  onClick,
  onMouseEnter,
  className = "",
  children,
}: {
  href: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group relative inline-block w-fit ${className}`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sage transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

/**
 * Navigatie die als paneel rechts inschuift (wit, wijnrode tekst), met
 * een halfdoorzichtige wijnrode backdrop erachter. "Collecties" klapt bij
 * hover de collectienamen eronder open, net als het desktop-megamenu.
 */
export function MobileNav({
  forceVisible = false,
}: {
  /** Toon de hamburger ook op grote schermen (voor de kale hero-nav vóór het scrollen). */
  forceVisible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setCollectionsOpen(false);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={forceVisible ? "" : "lg:hidden"}>
      <button
        type="button"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`relative z-50 flex cursor-pointer flex-col items-center justify-center ${
          forceVisible ? "h-14 w-14 gap-[9px]" : "h-11 w-11 gap-[7px]"
        } ${forceVisible && !open ? "text-white" : "text-wine"}`}
      >
        <span
          className={`block h-px bg-current transition-transform duration-300 ${
            forceVisible ? "w-8" : "w-6"
          } ${open ? (forceVisible ? "translate-y-[5px] rotate-45" : "translate-y-[4px] rotate-45") : ""}`}
        />
        <span
          className={`block h-px bg-current transition-transform duration-300 ${
            forceVisible ? "w-8" : "w-6"
          } ${
            open
              ? forceVisible
                ? "-translate-y-[5px] -rotate-45"
                : "-translate-y-[4px] -rotate-45"
              : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={menuTransition}
              onClick={() => setOpen(false)}
              aria-hidden
              className="fixed inset-0 z-30 bg-wine/30"
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={menuTransition}
              className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col overflow-y-auto bg-white px-8 pt-[72px] pb-10 text-wine antialiased"
            >
              <Image
                src="/logo/logo-round-v2.png"
                alt="Veramiek"
                width={600}
                height={600}
                className="-mt-6 h-32 w-32 self-start"
              />
              <nav
                aria-label="Mobiele navigatie"
                className="mt-10 flex flex-1 flex-col gap-6"
              >
                {navLinks.map((link) =>
                  link.label === "Collecties" ? (
                    <div
                      key={link.label}
                      onMouseEnter={() => setCollectionsOpen(true)}
                      onMouseLeave={() => setCollectionsOpen(false)}
                    >
                      <MenuLink
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="font-display text-2xl tracking-[0.08em]"
                      >
                        Collecties
                      </MenuLink>
                      <AnimatePresence>
                        {collectionsOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={menuTransition}
                            className="ml-5 space-y-2 overflow-hidden pt-3"
                          >
                            {collections.map((collection) => (
                              <li key={collection.name}>
                                <MenuLink
                                  href={collection.href}
                                  onClick={() => setOpen(false)}
                                  className="text-base opacity-80"
                                >
                                  {collection.name}
                                </MenuLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <MenuLink
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-2xl tracking-[0.08em]"
                    >
                      {link.label}
                    </MenuLink>
                  ),
                )}
              </nav>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Veramiek op Instagram"
                  className="-m-2 p-2 text-wine transition-opacity hover:opacity-70"
                >
                  <InstagramIcon className="h-7 w-7" />
                </a>
                <a
                  href={contact.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Veramiek op TikTok"
                  className="-m-2 p-2 text-wine transition-opacity hover:opacity-70"
                >
                  <TikTokIcon className="h-7 w-7" />
                </a>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Stuur Veramiek een WhatsApp-bericht"
                  className="-m-2 p-2 text-wine transition-opacity hover:opacity-70"
                >
                  <WhatsAppIcon className="h-7 w-7" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
