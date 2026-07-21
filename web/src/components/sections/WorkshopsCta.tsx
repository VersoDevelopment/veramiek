import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealSection } from "@/components/ui/RevealSection";

/**
 * Korte workshops-teaser: één kop, twee regels, één knop. Geen listing.
 */
export function WorkshopsCta() {
  return (
    <RevealSection id="workshops" className="bg-white px-5 py-24 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.85fr_1fr] md:gap-20 lg:gap-24">
        <div>
          <h2 className="text-4xl md:text-5xl">Workshop</h2>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
          <p className="mt-10 max-w-[42ch] text-lg opacity-85">
            Zin om zelf met klei te werken en iets moois te creëren? Tijdens deze
            workshop ontdek je verschillende handvormtechnieken en laat je jouw
            creativiteit vrij.
          </p>
          <p className="mt-6 max-w-[42ch] text-lg opacity-85">
            In 2,5 uur tijd maak jij jouw eigen keramiekstuk: handgevormd, uniek
            en helemaal door jou beschilderd.
          </p>
          <CtaButton href="/workshops" size="lg" className="mt-12">
            Meer info
          </CtaButton>
        </div>
        {/*
         * Verspringend duo in plaats van één vlak beeld: de grote foto staat
         * rechts uitgelijnd, de kleinere valt linksonder over de hoek heen en
         * steekt eronderuit. De onderrand van de kleine foto bepaalt de hoogte,
         * vandaar de padding onderaan.
         */}
        <div className="relative w-full pb-[18%]">
          <div className="relative ml-auto aspect-[4/5] w-[84%]">
            <Image
              src="/images/workshop.jpeg"
              alt="De werktafel klaargezet met klei, penselen en veldbloemen"
              fill
              sizes="(min-width: 768px) 46vw, 84vw"
              className="rounded-2xl object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-0 aspect-[3/4] w-[46%]">
            <Image
              src="/images/workshop-tafel-glazuren.webp"
              alt="Glazuren en een penseel klaargezet op de werktafel in het atelier"
              fill
              sizes="(min-width: 768px) 25vw, 46vw"
              className="rounded-2xl object-cover"
            />
            {/* Witte rand licht de foto van de grote af, zonder slagschaduw. */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl ring-[6px] ring-white"
            />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
