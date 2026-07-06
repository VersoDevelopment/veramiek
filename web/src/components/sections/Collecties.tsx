import { CollectionTile } from "@/components/ui/CollectionTile";
import { RevealSection } from "@/components/ui/RevealSection";
import { collections } from "@/lib/content";

/**
 * Collectiewand: grote foto's rand-aan-rand met een naad van 2px,
 * asymmetrische rijen (7/5 en 5/7) in plaats van vier identieke kaarten.
 */
export function Collecties() {
  return (
    <RevealSection id="collecties" className="bg-white py-24 md:py-32">
      <h2 className="mb-14 text-center text-3xl md:mb-20 md:text-4xl">
        Collecties
      </h2>
      <div className="grid grid-cols-1 gap-[2px] md:grid-cols-12">
        {collections.map((collection) => (
          <CollectionTile key={collection.name} collection={collection} />
        ))}
      </div>
    </RevealSection>
  );
}
