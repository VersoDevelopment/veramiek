"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { luxEase, revealDuration } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Hero met bewust herkenbare video-placeholder: atelierbeeld met Deep Wine
 * tint, een omlijnde play-knop (alleen affordance, geen echte video) en de
 * caption "Video binnenkort". De echte hero-video volgt later van de klant.
 */
export function Hero() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <Image
        src="/images/studio-hero.webp"
        alt="Het keramiekatelier van Vera"
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      {/*
       * Gelaagde tint in plaats van één vlakke overlay: een verticale gradient
       * die boven (nav) en onder donkerder is en het beeld in het midden laat
       * ademen, plus een zacht radiaal scrim achter de titel voor AA-contrast.
       * Zo leest het als een luxe verdieping van de foto, niet als kleurfilter.
       */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-wine/65 via-wine/20 to-wine/70"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(72%_56%_at_50%_43%,rgba(47,4,16,0.5),transparent_72%)]"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center text-white antialiased"
        initial={prefersReduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: revealDuration, ease: luxEase }}
      >
        <h1 className="max-w-3xl text-4xl text-balance md:text-5xl">
          Handgemaakt keramiek uit het atelier
        </h1>

        <span
          aria-hidden
          className="mt-12 flex h-20 w-20 items-center justify-center rounded-full border border-white/80 md:h-24 md:w-24"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            className="ml-1 h-8 w-8 md:h-9 md:w-9"
          >
            <path d="M7 4.5v15l13-7.5-13-7.5z" />
          </svg>
        </span>

        <p className="mt-6 text-sm tracking-[0.2em] text-white/70 uppercase">
          Video binnenkort
        </p>
      </motion.div>
    </section>
  );
}
