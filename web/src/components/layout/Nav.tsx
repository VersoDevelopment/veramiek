"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { NavMegaMenu } from "./NavMegaMenu";
import { MobileNav } from "./MobileNav";

const SCROLL_THRESHOLD = 60;

/** Boven de haarlijn: deze links staan in de linkergroep, Collecties + Workshops rechts. */
const leftLabels = ["Over mij", "Mijn blog", "Contact"];

/**
 * Fixed navigatie in twee lagen: links boven een bijna-schermbrede haarlijn
 * (links Over mij/Mijn blog/Contact, rechts Collecties/Workshops), daaronder
 * het gecentreerde logo. Transparant met witte tekst boven de hero; na ~60px
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
          ? "bg-white/90 text-wine backdrop-blur-md"
          : "bg-transparent text-white [&_a:focus-visible]:outline-white [&_button:focus-visible]:outline-white"
      }`}
    >
      <div className="px-5 md:px-10">
        {/* relative: het megamenu ankert aan deze rij en opent dus direct onder de haarlijn. */}
        <div
          className={`relative flex h-[56px] items-center justify-between border-b transition-colors duration-300 ${
            solid ? "border-sage/40" : "border-white/30"
          }`}
        >
          {/* Bij scrollen verhuist het logo naar boven de lijn, tussen de links in. */}
          {solid && (
            <Link
              href="/"
              aria-label="Veramiek, naar de homepage"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src="/logo/logo-horizontal.png"
                alt="Veramiek"
                width={520}
                height={130}
                className="h-8 w-auto"
                preload
              />
            </Link>
          )}
          <nav
            aria-label="Hoofdnavigatie links"
            className="hidden flex-1 items-center gap-9 lg:flex"
          >
            {navLinks
              .filter((link) => leftLabels.includes(link.label))
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

          <nav
            aria-label="Hoofdnavigatie rechts"
            className="hidden flex-1 items-center justify-end gap-9 lg:flex"
          >
            <NavMegaMenu solid={solid} />
            {navLinks
              .filter(
                (link) =>
                  !leftLabels.includes(link.label) && link.label !== "Collecties",
              )
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

        {!solid && (
          <div className="flex justify-center py-3">
            <Link href="/" aria-label="Veramiek, naar de homepage">
              <Image
                src="/logo/logo-horizontal-white.png"
                alt="Veramiek"
                width={520}
                height={130}
                className="h-9 w-auto md:h-10"
                preload
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
