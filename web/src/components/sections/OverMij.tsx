import Link from "next/link";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";

/**
 * Volle-breedte Deep Wine manifest: gecentreerde kop, sage haarlijn en
 * korte, galerie-rustige copy. Bewust zonder beeld; de tekst is het werk.
 */
export function OverMij() {
  return (
    <RevealSection id="over" stagger className="bg-wine text-white antialiased">
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-28 text-center md:py-40">
        <RevealItem>
          <h2 className="text-4xl md:text-5xl">Het atelier van Vera</h2>
        </RevealItem>
        <RevealItem>
          <div aria-hidden className="mx-auto mt-9 h-px w-12 bg-sage/70" />
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-10 max-w-[46ch] text-lg text-white/85">
            Ik ben Vera. In mijn atelier draai en glazuur ik elk stuk met de
            hand. Geen twee stukken zijn hetzelfde, en precies dat maakt dit
            werk voor mij zo mooi.
          </p>
        </RevealItem>
        <RevealItem>
          <Link
            href="/over-mij"
            className="mt-12 inline-block border-b border-white/40 pb-1 text-base tracking-[0.03em] transition-colors hover:border-white"
          >
            Lees meer over mij
          </Link>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
