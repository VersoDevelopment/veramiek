import Image from "next/image";
import Link from "next/link";
import { RevealSection } from "@/components/ui/RevealSection";

/**
 * Volle-breedte Deep Wine sectie met portret en korte, galerie-rustige copy.
 */
export function OverMij() {
  return (
    <RevealSection id="over" className="bg-wine text-white antialiased">
      <div className="grid md:min-h-[70vh] md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[42rem]">
          <Image
            src="/images/over-mij.jpeg"
            alt="Vera in haar atelier"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-20 md:px-16 md:py-28 lg:px-24 lg:py-32">
          <h2 className="text-4xl md:text-5xl">Het atelier van Vera</h2>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
          <p className="mt-10 max-w-[46ch] text-lg text-white/85">
            Ik ben Vera. In mijn atelier draai en glazuur ik elk stuk met de
            hand. Geen twee stukken zijn hetzelfde, en precies dat maakt dit
            werk voor mij zo mooi.
          </p>
          <Link
            href="/over-mij"
            className="mt-12 inline-block self-start border-b border-white/40 pb-1 text-base tracking-[0.03em] transition-colors hover:border-white"
          >
            Lees meer over mij
          </Link>
        </div>
      </div>
    </RevealSection>
  );
}
