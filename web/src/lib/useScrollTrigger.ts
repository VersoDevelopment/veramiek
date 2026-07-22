"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * True zolang de pagina voorbij `threshold` (px) is gescrold, false eronder.
 * Bij het kruisen van de drempel (in beide richtingen) verandert deze waarde,
 * waarna de aanroepende component er zelf een tijdgestuurde animatie (vaste
 * duration, los van scrollsnelheid) op kan laten reageren via `animate`.
 */
export function useScrollTrigger(
  threshold: number,
  mobileThreshold = threshold,
): boolean {
  const { scrollY } = useScroll();
  const [pastThreshold, setPastThreshold] = useState(false);

  function activeThreshold() {
    if (typeof window === "undefined") return threshold;
    return window.matchMedia("(max-width: 767px)").matches
      ? mobileThreshold
      : threshold;
  }

  useEffect(() => {
    setPastThreshold(scrollY.get() >= activeThreshold());

    function onResize() {
      setPastThreshold(scrollY.get() >= activeThreshold());
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileThreshold, scrollY, threshold]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastThreshold(latest >= activeThreshold());
  });

  return pastThreshold;
}
