import { CollectionAccordion } from "@/components/ui/CollectionAccordion";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";
import { collections } from "@/lib/content";

/**
 * Collectierij als accordion (zie CollectionAccordion): kop en de rij faden
 * gestaffeld in. De homepage toont de drie uitgelichte collecties; het
 * megamenu blijft de volledige lijst tonen.
 */
export function Collecties() {
  return (
    <RevealSection id="collecties" stagger className="bg-white py-24 md:py-32">
      <RevealItem>
        <h2 className="mb-14 text-center text-3xl md:mb-20 md:text-4xl">
          Collecties
        </h2>
      </RevealItem>
      <RevealItem>
        <CollectionAccordion collections={collections.slice(0, 3)} />
      </RevealItem>
    </RevealSection>
  );
}
