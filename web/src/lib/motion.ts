import type { Variants } from "motion/react";

/** Luxe, rustige easing voor alle scroll-reveals. */
export const luxEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealDuration = 0.9;

/** Standaard fade-in voor secties: subtiele opacity + kleine translateY. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: revealDuration, ease: luxEase },
  },
};

/** Parent-variant voor secties waarvan de kinderen gestaffeld verschijnen. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Snelle open/dicht-animatie voor UI-affordances zoals het megamenu. */
export const menuTransition = { duration: 0.18, ease: luxEase } as const;
