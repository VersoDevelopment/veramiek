"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerParent } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Laat de directe kinderen gestaffeld verschijnen in plaats van de sectie als geheel. */
  stagger?: boolean;
};

/**
 * Gedeelde scroll-fade wrapper: subtiele opacity + 14px translateY,
 * eenmalig bij het in beeld komen. Valt terug op statisch bij reduced motion.
 */
export function RevealSection({
  children,
  className,
  id,
  stagger = false,
}: RevealSectionProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      variants={stagger ? staggerParent : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}

/** Kind-element voor gestaffelde reveals binnen een RevealSection met `stagger`. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
