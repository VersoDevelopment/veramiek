"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Typemachine-effect: onthult `text` teken voor teken zolang `active` is.
 * Bij prefers-reduced-motion verschijnt de tekst direct volledig.
 */
export function useTypewriter(
  text: string,
  active: boolean,
  charInterval = 18,
): string {
  const prefersReduced = usePrefersReducedMotion();
  const [visibleChars, setVisibleChars] = useState(0);

  // Reset tijdens render zodra de activatie of de tekst wisselt
  // (het "adjust state when props change"-patroon, geen effect nodig).
  const key = `${active}|${text}`;
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setVisibleChars(active && prefersReduced ? text.length : 0);
  }

  useEffect(() => {
    if (!active || prefersReduced || visibleChars >= text.length) {
      return;
    }
    const timeout = window.setTimeout(
      () => setVisibleChars((count) => count + 1),
      charInterval,
    );
    return () => window.clearTimeout(timeout);
  }, [active, prefersReduced, visibleChars, text, charInterval]);

  if (active && prefersReduced) {
    return text;
  }

  return text.slice(0, visibleChars);
}
