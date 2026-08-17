import type { Metadata } from "next";
import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";
import { jsonLdScript } from "@/lib/jsonLd";
import { breadcrumbJsonLd, CATEGORY_PAGES, siteUrl } from "@/lib/seo";

/**
 * Lokale landingspagina.
 *
 * Aanleiding: Search Console laat 36 vertoningen zien op "handgemaakt keramiek
 * eindhoven" en de site had geen enkele pagina die op een plaatsnaam mikte.
 * Eindhoven is bewust NIET de insteek, want het atelier staat in Etten-Leur en
 * doen alsof dat anders is levert een pagina op die niemand kan waarmaken.
 *
 * Alles hieronder staat elders op de site ook: het atelier aan huis in
 * Etten-Leur (/over-mij), workshops in het atelier en op locatie (/workshops),
 * en ophalen of bezorgen in overleg (/winkelwagen). Geen verzonnen
 * openingstijden, geen adres dat nergens staat, geen lijst met plaatsnamen om
 * de pagina vol te maken. Dat laatste maakt er een doorway page van, en daar
 * rekent Google hard op af.
 */

const titel = "Handgemaakt keramiek uit Etten-Leur";
const omschrijving =
  "Handgemaakt keramiek uit het atelier van Vera in Etten-Leur. Online te bestellen, op te halen in overleg, en workshops in het atelier of op locatie in West-Brabant.";

export const metadata: Metadata = {
  title: titel,
  description: omschrijving,
  alternates: { canonical: "/keramiek-etten-leur" },
  openGraph: {
    type: "website",
    title: titel,
    description: omschrijving,
    url: "/keramiek-etten-leur",
  },
};

export default function KeramiekEttenLeurPage() {
  const crumbs = [
    { naam: "Home", pad: "/" },
    { naam: titel, pad: "/keramiek-etten-leur" },
  ];

  return (
    <RevealSection className="px-6 pt-44 pb-28 md:pb-36" stagger>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
      {/* Verwijst naar de LocalBusiness-node uit layout.tsx in plaats van hem
          te herhalen; twee losse bedrijfsprofielen op één site verwarren meer
          dan ze opleveren. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: titel,
            description: omschrijving,
            url: `${siteUrl}/keramiek-etten-leur`,
            inLanguage: "nl-NL",
            about: { "@id": `${siteUrl}/#veramiek` },
          }),
        }}
      />

      <div className="mx-auto max-w-[65ch]">
        <RevealItem>
          <h1 className="text-4xl text-balance md:text-5xl">{titel}</h1>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
        </RevealItem>

        <RevealItem className="mt-12 space-y-7 text-lg text-white/90">
          <p>
            Mijn atelier zit aan huis in Etten-Leur, op zolder. Daar staat de
            draaischijf, daar staan de planken vol drogend werk en daar wordt
            alles geglazuurd en gestookt. Elk stuk dat je op deze site ziet is
            in die ruimte gemaakt, van de eerste klomp klei tot het laatste
            glazuur.
          </p>
          <p>
            Omdat ik alles met de hand draai, is geen enkel stuk precies gelijk
            aan het volgende. Kleine verschillen in vorm, kleur en glazuur horen
            erbij. Dat is niet iets om weg te poetsen, dat is precies het
            verschil met een bord uit de fabriek.
          </p>
        </RevealItem>

        <RevealItem className="mt-14">
          <h2 className="text-2xl md:text-3xl">Bestellen en ophalen</h2>
          <div className="mt-6 space-y-7 text-lg text-white/90">
            <p>
              Je kunt mijn werk online bestellen. Woon je in Etten-Leur of in de
              buurt, dan kun je je bestelling ook ophalen in plaats van laten
              bezorgen. Na je bestelling neem ik persoonlijk contact op om
              betaling en bezorging of ophalen af te stemmen.
            </p>
            <p>
              Daarnaast sta ik regelmatig op markten, waar je alles in het echt
              kunt zien en vasthouden. Waar en wanneer dat is deel ik op{" "}
              <a
                href="https://www.instagram.com/veramiek.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </RevealItem>

        <RevealItem className="mt-14">
          <h2 className="text-2xl md:text-3xl">Workshops in de regio</h2>
          <div className="mt-6 space-y-7 text-lg text-white/90">
            <p>
              Zelf achter de draaischijf kan ook. Ik geef workshops in kleine
              groepen, zodat er tijd is om iedereen te helpen. Voor een
              vrijgezellenfeest, een teamuitje of gewoon met een paar vrienden
              kom ik ook op locatie in West-Brabant. Ik neem alles mee, van klei
              en gereedschap tot verf, en na afloop bak en glazuur ik jullie
              werk in mijn eigen atelier.
            </p>
          </div>
          <div className="mt-10">
            <CtaButton href="/workshops" variant="lightOutline">
              Bekijk de workshops
            </CtaButton>
          </div>
        </RevealItem>

        <RevealItem className="mt-14">
          <h2 className="text-2xl md:text-3xl">Wat er te koop is</h2>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {CATEGORY_PAGES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/keramiek/${c.slug}`}
                  className="text-base tracking-[0.03em] underline decoration-sage/60 decoration-1 underline-offset-4 opacity-85 transition-opacity hover:opacity-100"
                >
                  {c.titel}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <CtaButton href="/collecties">Bekijk alle collecties</CtaButton>
          </div>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
