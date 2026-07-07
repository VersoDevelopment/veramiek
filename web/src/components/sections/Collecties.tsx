import { CollectionTile } from "@/components/ui/CollectionTile";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";
import { collections } from "@/lib/content";

/**
 * Collectierij in galeriestijl: drie staande beelden van 450px breed naast
 * elkaar met een naad van 2px en wat lucht tot de schermranden.
 * Kop en tegels faden gestaffeld in.
 * De homepage toont de drie uitgelichte collecties; het megamenu blijft
 * de volledige lijst tonen.
 */
export function Collecties() {
  return (
    <RevealSection id="collecties" stagger className="bg-white py-24 md:py-32">
      <RevealItem>
        <h2 className="mb-14 text-center text-3xl md:mb-20 md:text-4xl">
          Collecties
        </h2>
      </RevealItem>
      {/* 3 tegels van 450px met een 2px naad; op kleinere schermen blijft er marge over via max-w. */}
      <div className="mx-auto grid w-[1354px] max-w-[calc(100vw-3rem)] grid-cols-1 gap-[2px] md:grid-cols-3">
        {collections.slice(0, 3).map((collection) => (
          <RevealItem key={collection.name}>
            <CollectionTile collection={collection} />
          </RevealItem>
        ))}
      </div>
    </RevealSection>
  );
}
