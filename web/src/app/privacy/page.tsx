import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Hoe Veramiek omgaat met je gegevens: wat er wordt vastgelegd bij een bestelling, boeking of bericht, hoe lang het bewaard blijft en welke rechten je hebt.",
  alternates: { canonical: "/privacy" },
};

/**
 * Privacybeleid. De inhoud beschrijft uitsluitend wat de site en de API
 * feitelijk doen: drie formulieren die per e-mail bij Vera terechtkomen, een
 * winkelwagen in localStorage, en geen tracking of advertentiecookies.
 */
export default function PrivacyPage() {
  return (
    <section className="px-6 pt-44 pb-28 md:pb-36">
      <div className="mx-auto max-w-[70ch]">
        <h1 className="text-4xl md:text-5xl">Privacybeleid</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
        <p className="mt-8 text-lg text-white/90">
          Veramiek is een eenmanszaak van Vera, gevestigd in Etten-Leur. Als je
          iets bestelt, een workshop boekt of een bericht stuurt, deel je
          gegevens met mij. Hieronder staat precies wat ik daarmee doe.
        </p>

        <div className="mt-16 space-y-14 text-lg text-white/85">
          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Wie verwerkt je gegevens
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              Veramiek, Etten-Leur, Noord-Brabant. Vragen over je gegevens gaan
              rechtstreeks naar mij via{" "}
              <a
                href={`mailto:${contact.email}`}
                className="underline underline-offset-4 hover:opacity-80"
              >
                {contact.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Welke gegevens en waarom
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <ul className="mt-6 space-y-6">
              <li>
                <strong className="font-normal text-white">
                  Contactformulier.
                </strong>{" "}
                Je naam, e-mailadres, onderwerp en bericht. Ik gebruik die
                alleen om je vraag te beantwoorden. Grondslag: gerechtvaardigd
                belang bij het beantwoorden van je eigen vraag.
              </li>
              <li>
                <strong className="font-normal text-white">Bestelling.</strong>{" "}
                Je naam, e-mailadres, telefoonnummer, adres en de stukken die je
                uitkiest. Nodig om je bestelling af te handelen, betaling en
                bezorging met je af te stemmen en je een bevestiging te sturen.
                Grondslag: uitvoering van de overeenkomst.
              </li>
              <li>
                <strong className="font-normal text-white">
                  Workshopboeking.
                </strong>{" "}
                Je naam, e-mailadres, telefoonnummer, de gekozen datum, het
                aantal personen en een eventueel bericht. Nodig om je plek vast
                te leggen en je een bevestiging met agenda-afspraak te sturen.
                Grondslag: uitvoering van de overeenkomst.
              </li>
            </ul>
            <p className="mt-6">
              Meer dan dit vraag ik niet. Er is geen account, geen nieuwsbrief
              en geen profiel dat achter je aan reist.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Cookies en meten
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              Deze site plaatst geen tracking- of advertentiecookies en gebruikt
              geen analyseprogramma dat je gedrag volgt. Daarom is er ook geen
              cookiebanner.
            </p>
            <p className="mt-6">
              Wat wel lokaal wordt opgeslagen: je winkelwagen. Die staat in de
              opslag van je eigen browser (localStorage), zodat je stukken niet
              verdwijnen als je de pagina ververst. Die gegevens komen niet bij
              mij terecht en je wist ze door je browsergegevens te legen.
            </p>
            <p className="mt-6">
              De lettertypen worden vanaf deze site zelf geserveerd, niet vanaf
              een server van Google. Er gaat dus geen verzoek naar derden als je
              een pagina opent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Wie je gegevens verder zien
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              Alleen de partijen die nodig zijn om de site te laten draaien:
            </p>
            <ul className="mt-6 space-y-4">
              <li>
                De hostingpartij waar de site en de server staan, binnen de
                Europese Unie.
              </li>
              <li>
                Zoho Mail (Europese servers) voor het verzenden en ontvangen van
                de e-mails die uit de formulieren komen.
              </li>
            </ul>
            <p className="mt-6">
              Je gegevens worden niet verkocht en niet gebruikt voor reclame van
              anderen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Hoe lang ik het bewaar
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              Berichten uit het contactformulier bewaar ik zolang het gesprek
              loopt en daarna hooguit een jaar. Boekingsgegevens blijven staan
              tot de workshop is geweest en daarna nog kort voor de
              administratie. Gegevens die bij een bestelling horen bewaar ik
              zeven jaar, omdat de Belastingdienst dat voor facturen voorschrijft.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Je rechten
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              Je mag opvragen welke gegevens ik van je heb, ze laten corrigeren
              of laten verwijderen, en bezwaar maken tegen het gebruik ervan.
              Stuur daarvoor een bericht naar{" "}
              <a
                href={`mailto:${contact.email}`}
                className="underline underline-offset-4 hover:opacity-80"
              >
                {contact.email}
              </a>
              . Ik reageer binnen een maand. Kom je er met mij niet uit, dan kun
              je een klacht indienen bij de Autoriteit Persoonsgegevens.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[0.04em] text-white md:text-3xl">
              Beveiliging
            </h2>
            <div aria-hidden className="mt-5 h-px w-8 bg-sage/60" />
            <p className="mt-6">
              De site draait volledig over een beveiligde verbinding (https) en
              de formulieren zijn beveiligd tegen misbruik. De server staat
              achter een firewall en alleen ik heb toegang tot de beheeromgeving.
            </p>
          </section>
        </div>

        <p className="mt-16 text-base text-white/60">
          Vragen hierover?{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 hover:text-white/90"
          >
            Stuur me een bericht
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
