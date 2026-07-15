"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const MORPH_DURATION_S = 0.35;

/**
 * Vervormt (blur + liquid-threshold) van de ene tekst naar de andere zodra
 * `text` verandert, in plaats van een simpele crossfade. Gebaseerd op het
 * "liquid text"-morph-patroon, maar controlled i.p.v. auto-cyclend door een
 * vaste lijst.
 */
export function MorphName({ text, className = "" }: { text: string; className?: string }) {
  const filterId = useId();
  const prevTextRef = useRef(text);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (!current1 || !current2) return;
    current1.textContent = text;
    current1.style.filter = "none";
    current1.style.opacity = "100%";
    current2.textContent = "";
    current2.style.opacity = "0%";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (text === prevTextRef.current) return;
    const from = prevTextRef.current;
    const to = text;
    prevTextRef.current = text;

    const [wrapper, current1, current2] = [wrapperRef.current, text1Ref.current, text2Ref.current];
    if (!wrapper || !current1 || !current2) return;

    cancelAnimationFrame(rafRef.current);

    if (prefersReducedMotion) {
      current1.textContent = to;
      current1.style.filter = "none";
      current1.style.opacity = "100%";
      current2.textContent = "";
      current2.style.opacity = "0%";
      return;
    }

    current1.textContent = from;
    current2.textContent = to;
    // De goo/threshold-filter alleen aan tijdens de morph zelf, anders oogt
    // de tekst in rust onnodig zacht/onscherp.
    wrapper.style.filter = `url(#${filterId}) blur(0.6px)`;

    let start: number | null = null;

    const settle = () => {
      current1.style.filter = "none";
      current1.style.opacity = "0%";
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      wrapper.style.filter = "none";
    };

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const fraction = Math.min((timestamp - start) / 1000 / MORPH_DURATION_S, 1);

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inverted = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / inverted - 8, 100)}px)`;
      current1.style.opacity = `${Math.pow(inverted, 0.4) * 100}%`;

      if (fraction >= 1) {
        settle();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, prefersReducedMotion, filterId]);

  return (
    <span
      ref={wrapperRef}
      className={`relative inline-grid place-items-center ${className}`}
      style={{ filter: "none" }}
    >
      <span ref={text1Ref} className="[grid-area:1/1] block whitespace-nowrap" />
      <span ref={text2Ref} className="[grid-area:1/1] block whitespace-nowrap" />
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
