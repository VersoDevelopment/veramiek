"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { luxEase } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Portretfoto op de over-mij-pagina: een trage scale+fade-in (langer en
 * rustiger dan de standaard RevealItem-reveal) voor een net iets luxere
 * binnenkomst dan de rest van de tekst eromheen.
 */
export function OverMijPhoto() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, scale: 1.06 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.4, ease: luxEase }}
      className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden"
    >
      <Image
        src="/images/vera-portret-bruin-zonnig.webp"
        alt="Vera, keramist en maker achter Veramiek"
        fill
        sizes="(min-width: 768px) 24rem, 85vw"
        className="object-cover"
      />
    </motion.div>
  );
}
