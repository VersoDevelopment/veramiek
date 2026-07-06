"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { NavMegaMenu } from "./NavMegaMenu";
import { MobileNav } from "./MobileNav";

const SCROLL_THRESHOLD = 60;

/** Links van het gecentreerde logo; de rest staat rechts. */
const leftLabels = ["Collecties", "Over mij"];

/**
 * Schermbrede, fixed navigatie met gecentreerd logo en een doorlopende
 * haarlijn onderlangs. Transparant met witte tekst boven de hero; na ~60px
 * scroll een wit, geblurd vlak met Deep Wine tekst en logo-wissel.
 * Op subpagina's (zonder hero) staat de nav altijd in de "solid" stand.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 antialiased transition-colors duration-300 ${
        solid
          ? "border-b border-sage/40 bg-white/90 text-wine backdrop-blur-md"
          : "border-b border-white/30 bg-transparent text-white [&_a:focus-visible]:outline-white [&_button:focus-visible]:outline-white"
      }`}
    >
      <div className="relative flex h-[72px] w-full items-center px-5 md:px-10">
        <nav
          aria-label="Hoofdnavigatie links"
          className="hidden flex-1 items-center gap-9 lg:flex"
        >
          <NavMegaMenu solid={solid} />
          {navLinks
            .filter((link) => leftLabels.includes(link.label) && link.label !== "Collecties")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base tracking-[0.03em] opacity-85 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <Link
          href="/"
          aria-label="Veramiek, naar de homepage"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src={solid ? "/logo/logo-horizontal.png" : "/logo/logo-horizontal-white.png"}
            alt="Veramiek"
            width={520}
            height={130}
            className="h-9 w-auto md:h-10"
            preload
          />
        </Link>

        <nav
          aria-label="Hoofdnavigatie rechts"
          className="hidden flex-1 items-center justify-end gap-9 lg:flex"
        >
          {navLinks
            .filter((link) => !leftLabels.includes(link.label))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base tracking-[0.03em] opacity-85 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="ml-auto lg:hidden">
          <MobileNav solid={solid} />
        </div>
      </div>
    </header>
  );
}
