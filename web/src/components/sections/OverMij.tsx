import { BookOpen, Gem, Hand } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";

/**
 * Volle-breedte Deep Wine sectie met een samenvatting van Vera's verhaal:
 * gecentreerde kop met sage haarlijn, korte introductie, daaronder de
 * pullquote (breder dan de tekst, tussen twee subtiele sage-haarlijntjes met
 * witruimte erboven en eronder), en pas daaronder de knoppen: "Lees mijn
 * volledige verhaal" (naar /over-mij) los en gecentreerd boven de twee
 * secundaire knoppen.
 */
export function OverMij() {
  return (
    <RevealSection id="over" stagger className="bg-wine text-white antialiased">
      <div className="mx-auto max-w-[100rem] px-6 py-28 md:px-16 md:py-36">
        <RevealItem className="text-center">
          <h2 className="text-4xl md:text-5xl">Over mij</h2>
          <div aria-hidden className="mx-auto mt-9 h-px w-12 bg-sage/70" />
        </RevealItem>

        <RevealItem>
          <div className="mt-14 text-center">
            <p className="mx-auto max-w-[60ch] text-lg text-white/85">
              Ik ben Vera, keramist en maker achter Veramiek. Wat begon als
              een cursus pottenbakken groeide uit tot een eigen atelier in
              Etten-Leur, waar ik met klei werk aan stukken die generaties
              meegaan. Ik geef ook workshops aan iedereen die hetzelfde
              rustpunt zoekt als ik vond.
            </p>

            <div aria-hidden className="mx-auto my-9 h-px w-10 bg-sage/60" />

            <p className="mx-auto max-w-[85ch] font-display text-xl tracking-[0.03em] text-white italic">
              Met je handen werken is bijna magisch: je wordt één met de
              klei, komt volledig tot rust en je creëert iets dat blijft.
            </p>

            <div aria-hidden className="mx-auto my-9 h-px w-10 bg-sage/60" />
          </div>
        </RevealItem>

        <RevealItem>
          <div className="mt-14 flex flex-col items-center gap-4">
            <CtaButton href="/over-mij" variant="light" icon={<BookOpen size={18} />}>
              Lees mijn volledige verhaal
            </CtaButton>
            <div className="flex flex-wrap justify-center gap-4">
              <CtaButton href="/#collecties" variant="lightOutline" icon={<Gem size={18} />}>
                Bekijk de collecties
              </CtaButton>
              <CtaButton href="/workshops" variant="lightOutline" icon={<Hand size={18} />}>
                Naar de workshops
              </CtaButton>
            </div>
          </div>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
