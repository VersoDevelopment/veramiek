"use client";

import { useEffect } from "react";

/**
 * Vangnet voor onverwachte fouten. De bezoeker krijgt een pagina in de huisstijl
 * in plaats van het kale Next-foutscherm; de fout zelf gaat naar de console
 * zodat hij in de browserlogs terug te vinden is.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-40 pb-28 text-center">
      <h1 className="text-4xl md:text-5xl">Er ging iets mis</h1>
      <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
      <p className="mt-8 max-w-[46ch] text-lg text-white/90">
        Deze pagina kon even niet geladen worden. Probeer het opnieuw, of stuur
        me een bericht als het blijft gebeuren.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center rounded-full bg-white px-8 py-3 text-base tracking-[0.03em] text-wine transition-opacity duration-300 hover:opacity-85"
        >
          Probeer opnieuw
        </button>
        {/*
          Bewust een gewone link en geen next/link: dit is een foutgrens, en
          een harde navigatie zet de kapotte staat helemaal terug. Een
          client-side overgang zou die juist kunnen meenemen.
        */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center rounded-full border border-white px-8 py-3 text-base tracking-[0.03em] transition-colors duration-300 hover:bg-white hover:text-wine"
        >
          Naar de homepage
        </a>
      </div>
    </section>
  );
}
