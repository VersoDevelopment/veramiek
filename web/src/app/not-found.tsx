import type { Metadata } from "next";
import { CtaButton } from "@/components/ui/CtaButton";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

/**
 * Eigen 404 in plaats van de kale Next-standaardpagina. Zelfde wijnrode
 * drager en sage haarlijn als de rest van de site.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-40 pb-28 text-center">
      <p className="text-base tracking-[0.22em] text-white/55 uppercase">404</p>
      <h1 className="mt-6 text-4xl md:text-5xl">Deze pagina bestaat niet</h1>
      <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
      <p className="mt-8 max-w-[46ch] text-lg text-white/90">
        Misschien is de pagina verhuisd of klopt er iets niet in de link. Kijk
        gerust verder in de collecties of stuur me een bericht.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <CtaButton href="/collecties" variant="light">
          Bekijk de collecties
        </CtaButton>
        <CtaButton href="/contact" variant="lightOutline">
          Contact
        </CtaButton>
      </div>
    </section>
  );
}
