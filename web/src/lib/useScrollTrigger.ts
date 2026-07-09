"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * True zolang de pagina voorbij `threshold` (px) is gescrold, false eronder.
 * Bij het kruisen van de drempel (in beide richtingen) verandert deze waarde,
 * waarna de aanroepende component er zelf een tijdgestuurde animatie (vaste
 * duration, los van scrollsnelheid) op kan laten reageren via `animate`.
 */
export function useScrollTrigger(threshold: number): boolean {
  const { scrollY } = useScroll();
  const [pastThreshold, setPastThreshold] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastThreshold(latest >= threshold);
  });

  return pastThreshold;
}
