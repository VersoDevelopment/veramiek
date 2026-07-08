import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealSection } from "@/components/ui/RevealSection";

export const metadata: Metadata = {
  title: "Mijn blogs | Veramiek",
  description:
    "Verhalen uit het atelier: hoe een cursus keramiek in september 2025 uitgroeide tot Veramiek.",
};

export default function BlogPage() {
  return (
    <RevealSection className="bg-white px-6 pt-44 pb-28 md:pb-36">
      <article className="mx-auto max-w-[65ch]">
        <p className="text-base tracking-[0.22em] text-wine/55 uppercase">
          Het begin, 2025
        </p>
        <h1 className="mt-4 text-4xl text-balance md:text-5xl">
          Hoe Veramiek ontstond
        </h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

        <div className="relative mt-12 aspect-[16/9] overflow-hidden">
          <Image
            src="/images/studio-hero.webp"
            alt="Het atelier van Veramiek op zolder"
            fill
            sizes="(min-width: 768px) 65ch, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-12 space-y-7 text-lg text-wine/90">
          <p>
            In september 2025 begon ik aan een cursus keramiek, zonder enig
            idee waar het toe zou leiden. Vanaf de eerste les voelde ik het:
            dit is helemaal mijn ding, hoe ik mijn creativiteit erin kwijt kan
            en rust vind in mijn hoofd. Tijdens een vakantie kocht ik
            tweedehands mijn eerste draaischijf en een oven. Ineens kon ik
            thuis écht aan de slag. Op zolder hadden we nog ruimte vrij, en
            daar ontstond langzaam mijn atelier: eerst een draaischijf, planken
            om mijn creaties op te zetten, een spiegel, mijn logo aan de muur.
            Stukje bij beetje groeide het uit tot een plek die helemaal van mij
            is.
          </p>
          <p>
            Ik ben begonnen met heel veel oefenen. Ik maakte mooie stukken,
            maar maakte ook veel fouten waar ik weer van kon leren. Ik maakte
            stukken voor familie, gaf cadeaus, leerde van mislukkingen en
            vierde de successen. Daarna ben ik begonnen met het verkopen en
            kreeg ik steeds meer orders. Zo ontstond Veramiek: vanuit plezier,
            nieuwsgierigheid en de wens om iets met mijn handen te maken. Een
            atelier waar ik nu niet alleen mijn eigen keramiek maak, maar ook
            workshops geef en anderen laat ervaren hoe bijzonder het is om met
            klei te werken.
          </p>
          <p>
            Ik kan natuurlijk doen alsof ik een pro ben in wat ik doe, maar dat
            is niet waar. Iedere dag leer ik weer meer en ik maak nog steeds
            fouten. Maar dat maakt het ook zo leuk: blijven leren en ontdekken,
            en natuurlijk met als doel om steeds beter te worden in het vak.
          </p>
          <p>
            Daarom start ik in september weer met een opleiding, om de
            technieken en theoretische kennis die je moet hebben als keramist
            nóg beter te leren kennen. Hier heb ik ontzettend veel zin in en ik
            zal jullie ook zeker meenemen in dit proces.
          </p>
          <p>
            Want ja, niemand is perfect en het is uiteindelijk ook gewoon doen.
            Ik vind het geweldig om jullie hierin mee te nemen en kan niet
            wachten om nog meer kennis op te doen en dit met jullie te kunnen
            delen.
          </p>
        </div>

        <div className="mt-14">
          <CtaButton href="/workshops" variant="outline">
            Zelf klei ervaren? Naar de workshops
          </CtaButton>
        </div>
      </article>
    </RevealSection>
  );
}
