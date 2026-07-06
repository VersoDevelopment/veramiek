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
          <h2 className="text-4xl md:text-5xl">Zelf aan de draaischijf</h2>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
          <p className="mt-10 max-w-[42ch] text-lg opacity-85">
            Kom een middag naar het atelier en voel hoe klei onder je handen
            vorm krijgt. Voor beginners en gevorderden, in kleine groepen.
          </p>
          <CtaButton href="/workshops" size="lg" className="mt-12">
            Bekijk de workshops
          </CtaButton>
        </div>
        <div className="relative aspect-[5/6] w-full md:aspect-[4/5]">
          <Image
            src="/images/workshop.jpeg"
            alt="Deelnemers aan een keramiekworkshop achter de draaischijf"
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </RevealSection>
  );
}
