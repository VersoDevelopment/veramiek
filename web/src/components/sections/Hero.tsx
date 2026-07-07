"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Scroll-expansie hero: de atelierfoto staat als achtergrond en de video
 * hangt klein in het midden; tijdens het scrollen door de sectie groeit de
 * video tot de volledige viewport en schuiven de titelregels uiteen.
 * Bewust zonder scroll-hijacking (hoge sectie + sticky binnenkant), zodat
 * ankerlinks, toetsenbord en gewoon scrollen blijven werken.
 * Bij reduced motion: statische hero zonder expansie of autoplay.
 * De video is een placeholder (Video 1.mp4) tot de klant de echte levert.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Beginstand bewust portrait (staand), zoals de aan te leveren video.
  // Als calc-blend, want Motion kan strings met verschillende eenheden
  // (rem naar vw) niet rechtstreeks interpoleren.
  const mediaWidth = useTransform(
    scrollYProgress,
    (v) => `min(calc(${(1 - v) * 21}rem + ${v * 100}vw), 100vw)`,
  );
  const mediaHeight = useTransform(
    scrollYProgress,
    (v) => `min(calc(${(1 - v) * 30}rem + ${v * 100}svh), 100svh)`,
  );
  const lineOneShift = useTransform(scrollYProgress, [0, 0.7], ["0vw", "-60vw"]);
  const lineTwoShift = useTransform(scrollYProgress, [0, 0.7], ["0vw", "60vw"]);
  const titleOpacity = useTransform(scrollYProgress, [0.45, 0.75], [1, 0]);

  if (prefersReduced) {
    return (
      <section className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-wine">
        <video
          src="/videos/hero.mp4"
          poster="/images/studio-hero.webp"
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-wine/65 via-wine/25 to-wine/70"
        />
        <h1 className="relative z-10 px-6 text-center text-4xl text-white antialiased md:text-6xl">
          Handgemaakt keramiek
          <br />
          uit het atelier
        </h1>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[200svh] bg-wine">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/studio-hero.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            preload
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine/65 via-wine/25 to-wine/70" />
        </div>

        <motion.div
          style={{ width: mediaWidth, height: mediaHeight }}
          className="relative overflow-hidden"
        >
          <video
            src="/videos/hero.mp4"
            poster="/images/studio-hero.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-wine/15" />
        </motion.div>

        <motion.h1
          style={{ opacity: titleOpacity, top: "calc(50% + min(15rem, 31svh) + 2rem)" }}
          className="pointer-events-none absolute inset-x-0 z-10 text-center text-3xl text-white antialiased md:text-5xl"
        >
          <motion.span style={{ x: lineOneShift }} className="block">
            Handgemaakt keramiek
          </motion.span>
          <motion.span style={{ x: lineTwoShift }} className="block">
            uit het atelier
          </motion.span>
        </motion.h1>
      </div>
    </section>
  );
}
