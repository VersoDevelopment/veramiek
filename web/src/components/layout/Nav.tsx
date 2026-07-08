"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/content";
import { MobileNav } from "./MobileNav";
import { CartButton } from "@/components/cart/CartButton";

const SCROLL_THRESHOLD = 60;

/**
 * Fixed navigatie. Op de homepage, bovenaan (nog niet gescrold), staat er
 * een witte balk (wijnrood bij hover) met logo linksboven en gecentreerde
 * links; de "solid" stand verschijnt zodra er ~60px gescrold is, of altijd
 * op subpagina's (zonder hero): logo links, cart + hamburger rechts, wit
 * geblurd vlak met Deep Wine tekst.
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
          : "bg-transparent text-white"
      }`}
    >
      {solid ? (
        <div className="px-5 md:px-10">
          <div className="flex h-[56px] items-center justify-between border-b border-sage/40 transition-colors duration-300">
            <Link href="/" aria-label="Veramiek, naar de homepage">
              <Image
                src="/logo/logo-horizontal.png"
                alt="Veramiek"
                width={520}
                height={130}
                className="h-8 w-auto"
                preload
              />
            </Link>

            <div className="flex items-center gap-5">
              <CartButton />
              <MobileNav />
            </div>
          </div>
        </div>
      ) : (
        <div className="group relative flex h-[92px] items-center justify-between bg-white px-5 text-wine transition-colors duration-300 hover:bg-wine hover:text-white md:px-10">
          <Link
            href="/"
            aria-label="Veramiek, naar de homepage"
            className="relative block h-12 md:h-14"
          >
            <Image
              src="/logo/logo-horizontal.png"
              alt="Veramiek"
              width={520}
              height={130}
              className="h-full w-auto opacity-100 transition-opacity duration-300 group-hover:opacity-0"
              preload
            />
            <Image
              src="/logo/logo-horizontal-white.png"
              alt="Veramiek"
              width={520}
              height={130}
              className="absolute inset-0 h-full w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              preload
            />
          </Link>

          <nav
            aria-label="Hoofdnavigatie"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base tracking-[0.03em] opacity-85 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <CartButton />
        </div>
      )}
    </header>
  );
}
