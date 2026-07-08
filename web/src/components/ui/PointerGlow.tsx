"use client";

import { useEffect } from "react";

/**
 * Zet de pointerpositie eenmalig als CSS custom properties op de root
 * (--glow-x, --glow-y, --glow-xp), zodat elk element met `data-glow`
 * (zie globals.css) de cursor kan volgen zonder een eigen listener.
 */
export function PointerGlowProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e: PointerEvent) => {
      root.style.setProperty("--glow-x", `${e.clientX}px`);
      root.style.setProperty("--glow-y", `${e.clientY}px`);
      root.style.setProperty("--glow-xp", (e.clientX / window.innerWidth).toFixed(3));
    };

    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
