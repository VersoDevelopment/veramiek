import type { Metadata } from "next";
import { OverMijPhoto } from "@/components/sections/OverMijPhoto";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealItem, RevealSection } from "@/components/ui/RevealSection";

export const metadata: Metadata = {
  title: "Over mij",
  description:
    "Ik ben Vera, keramist en maker achter Veramiek. Lees hoe een cursus pottenbakken uitgroeide tot een eigen atelier in Etten-Leur.",
  alternates: { canonical: "/over-mij" },
};

export default function OverMijPage() {
  return (
    <RevealSection className="px-6 pt-44 pb-28 md:pb-36" stagger>
      <div className="mx-auto max-w-[65ch]">
        <RevealItem>
          <h1 className="text-4xl md:text-5xl">Over mij</h1>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
        </RevealItem>

        <RevealItem className="mt-12 space-y-7 text-lg text-white/90">
          <p>
            Ik ben Vera, 26 jaar oud, keramist en maker achter Veramiek. Samen
            met mijn partner Kenny en onze nieuwsgierige hond Ollie woon ik in
            Etten-Leur. Ollie loopt regelmatig rond in mijn atelier en is
            altijd erg nieuwsgierig wat ik daar nou allemaal aan het doen ben,
            dus grote kans dat je hem af en toe voorbij ziet komen op mijn
            website of socials. Hij is mijn kleine sidekick en grootste
            supporter.
          </p>
          <p>
            Mijn atelier is de plek waar ik tot rust kom. Hier ontstaan unieke,
            handgemaakte keramiekstukken, gemaakt met aandacht, geduld en
            liefde voor het ambacht. De stukken die ik maak zijn bedoeld om
            generaties lang mee te gaan en een mooi plekje te krijgen in jouw
            huis.
          </p>
        </RevealItem>

        <RevealItem className="my-14">
          <OverMijPhoto />
        </RevealItem>

        <RevealItem className="space-y-7 text-lg text-white/90">
          <p>
            Ik verkoop mijn collecties online, sta op verschillende markten en
            geef workshops waarin ik mensen laat ervaren hoe bijzonder het is
            om iets met je eigen handen te creëren.
          </p>
          <p>
            Een tijd geleden zat ik niet goed in mijn vel. Ik voelde druk om
            carrière te maken zoals mensen om me heen dat deden, maar wist niet
            wat mijn eigen pad was. Toen kwam ik een cursus pottenbakken tegen.
            Voor velen maar iets kleins, maar het raakte meteen iets in mij.
          </p>
          <p>
            Na de eerste les was ik verkocht. Het werken met klei bracht rust,
            focus en plezier terug in mijn leven. In de vakantie kocht ik een
            tweedehands draaischijf en oven, en vanaf dat moment wist ik: dit
            is het. Zo ontstond mijn onderneming Veramiek: Vera plus keramiek.
            Een naam die bijna vanzelf kwam, alsof het zo had moeten zijn.
          </p>
          <p>
            Keramiek is voor mij meer dan een ambacht. Het is een manier om te
            vertragen, om offline te zijn en om te voelen hoe het is om zelf
            iets te maken.
          </p>
        </RevealItem>

        <RevealItem>
          <blockquote className="my-14 border-l border-sage/70 pl-8 font-display text-2xl leading-snug tracking-[0.04em] md:text-3xl">
            Met je handen werken is bijna magisch: je wordt één met de klei,
            komt volledig tot rust en je creëert iets dat blijft.
          </blockquote>
        </RevealItem>

        <RevealItem className="space-y-7 text-lg text-white/90">
          <p>
            Ik geloof dat creativiteit en ambacht goed zijn voor je mentale
            gezondheid. Voor mij is het een plek waar ik mezelf terugvind, en
            dat is precies wat ik wil doorgeven via mijn werk en workshops.
          </p>
          <p>
            Kijk zeker even verder op mijn website en wie weet zie ik je
            binnenkort op een markt of tijdens een workshop. Dan hoop ik dat ik
            jou een stukje van mijn enthousiasme en liefde voor het vak kan
            meegeven. Of dat nu is door een mooi stuk keramiek te kopen, of
            door zelf met je handen in de klei te duiken tijdens een workshop.
          </p>
        </RevealItem>

        <RevealItem className="mt-14 flex flex-wrap gap-4">
          <CtaButton href="/#collecties" variant="lightOutline">
            Bekijk de collecties
          </CtaButton>
          <CtaButton href="/workshops" variant="lightOutline">
            Naar de workshops
          </CtaButton>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
