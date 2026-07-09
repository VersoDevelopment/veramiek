"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { luxEase, revealDuration } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** Hoe lang het ronde logo volledig zichtbaar blijft voor het wegfadet. */
const LOGO_HOLD_MS = 1500;
const LOGO_FADE_MS = 400;
/** Wit trekt overlappend weg, ruim voordat wijnrood klaar is. */
const WHITE_START_DELAY_MS = 450;

/** Totale tijd tot beide panelen volledig zijn weggetrokken; Hero.tsx bouwt hierop voort voor zijn eigen intro-fade. */
export const INTRO_TOTAL_MS =
  LOGO_HOLD_MS + LOGO_FADE_MS + WHITE_START_DELAY_MS + revealDuration * 1000;

type Phase = "logo" | "logoOut" | "wine" | "white" | "done";

/**
 * Homepage-intro: het ronde logo verschijnt gecentreerd, houdt ~2s vol en
 * fadet weg, waarna een wijnrood en daarna (overlappend) een wit vlak van
 * onder naar boven wegtrekken tot aan de header en de hero onthullen. Beide
 * vlakken liggen er vanaf het begin al (wijnrood boven op wit); "wegtrekken"
 * is een scaleY 1→0 met transform-origin boven, zodat de bovenrand tegen de
 * header blijft staan terwijl de onderrand omhoog komt.
 */
export function LoadIntro() {
  const prefersReduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("logo");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReduced) {
      setPhase("done");
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase("logoOut"), LOGO_HOLD_MS),
      window.setTimeout(
        () => setPhase("wine"),
        LOGO_HOLD_MS + LOGO_FADE_MS,
      ),
      window.setTimeout(
        () => setPhase("white"),
        LOGO_HOLD_MS + LOGO_FADE_MS + WHITE_START_DELAY_MS,
      ),
      window.setTimeout(() => setPhase("done"), INTRO_TOTAL_MS),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReduced]);

  // Laadpercentage 0→100 gelijk aan de logo-houdtijd, los van de fase-timers
  // omdat de tekst per frame moet bijwerken i.p.v. via een CSS-transition.
  useEffect(() => {
    if (prefersReduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / LOGO_HOLD_MS);
      setProgress(Math.round(ratio * 100));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  if (phase === "done") return null;

  const logoVisible = phase === "logo";
  const wineRetracted = phase === "wine" || phase === "white";
  const whiteRetracted = phase === "white";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[92px] bottom-0 z-[60] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: whiteRetracted ? 0 : 1 }}
        transition={{ duration: revealDuration, ease: luxEase }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-wine"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: wineRetracted ? 0 : 1 }}
        transition={{ duration: revealDuration, ease: luxEase }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: logoVisible ? 1 : 0, scale: logoVisible ? 1 : 0.92 }}
          transition={{ duration: LOGO_FADE_MS / 1000, ease: luxEase }}
          className="flex flex-col items-center"
        >
          <Image
            src="/logo/logo-round-white.png"
            alt="Veramiek"
            width={600}
            height={600}
            className="h-32 w-32"
            preload
          />

          <div className="mt-6 h-px w-28 overflow-hidden bg-white/20">
            <motion.div
              className="h-full bg-sage"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: LOGO_HOLD_MS / 1000, ease: "linear" }}
            />
          </div>
          <p className="mt-3 font-body text-base tracking-[0.08em] text-white/70 tabular-nums">
            {progress}%
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
