"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { NavMegaMenu } from "./NavMegaMenu";
import { MobileNav } from "./MobileNav";
import { CartButton } from "@/components/cart/CartButton";

const SCROLL_THRESHOLD = 60;

/** Boven de haarlijn: deze links staan in de linkergroep, Collecties + Workshops rechts. */
const leftLabels = ["Over mij", "Mijn blogs", "Contact"];

/**
 * Fixed navigatie. Op de homepage, bovenaan (nog niet gescrold), staat er
 * alleen een kale balk met het logo linksboven en een hamburger rechtsboven;
 * de volledige nav verschijnt pas zodra er ~60px gescrold is. Op subpagina's
 * (zonder hero) staat de nav altijd meteen in de "solid" stand.
 * Solid: twee lagen (links boven een bijna-schermbrede haarlijn: Over mij/
 * Mijn blogs/Contact, rechts Collecties/Workshops), daaronder het
 * gecentreerde logo; wit, geblurd vlak met Deep Wine tekst en logo-wissel.
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
          ? "bg-wine/90 text-white backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      {solid ? (
        <div className="px-5 md:px-10">
          {/* relative: het megamenu ankert aan deze rij en opent dus direct onder de haarlijn. */}
          <div className="relative flex h-[56px] items-center justify-between border-b border-sage/40 transition-colors duration-300">
            {/* Logo tussen de links in, boven de haarlijn. */}
            <Link
              href="/"
              aria-label="Veramiek, naar de homepage"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src="/logo/logo-horizontal-white.png"
                alt="Veramiek"
                width={520}
                height={130}
                className="h-8 w-auto"
                preload
              />
            </Link>
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
              <CartButton className="ml-1" />
            </nav>

            <div className="ml-auto flex items-center gap-5 lg:hidden">
              <CartButton />
              <MobileNav />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[92px] items-center justify-between px-5 md:px-10">
          <Link href="/" aria-label="Veramiek, naar de homepage">
            <Image
              src="/logo/logo-horizontal-white.png"
              alt="Veramiek"
              width={520}
              height={130}
              className="h-12 w-auto md:h-14"
              preload
            />
          </Link>
          <div className="flex items-center gap-5">
            <CartButton />
            <MobileNav forceVisible />
          </div>
        </div>
      )}
    </header>
  );
}
