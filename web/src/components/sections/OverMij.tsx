"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RevealItem } from "@/components/ui/RevealSection";
import {
  luxEase,
  SCROLL_FADE_STAGGER,
  MOBILE_SCROLL_FADE_TRIGGER,
  SCROLL_FADE_TRIGGER,
  SCROLL_TRIGGER_FADE_DURATION,
  staggerParent,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollTrigger } from "@/lib/useScrollTrigger";

/**
 * Portret van Vera dat over de naad van Hero/OverMij heen "landt": de foto
 * steekt voor 33% van zijn hoogte in de hero, de rest valt binnen deze
 * sectie. Omdat deze sectie later in de DOM staat dan Hero, tekent hij daar
 * gewoon overheen (geen extra z-index-gedoe nodig). "VERA" erboven overlapt
 * zelf weer 50/50 met de bovenkant van de foto.
 *
 * Breedte via clamp (niet een vaste rem-max): op ~2440px zit hij precies op
 * het plafond van de clamp (het formaat dat al goed stond), op smallere
 * schermen zoals 1920px schaalt hij evenredig mee terug i.p.v. daar
 * verhoudingsgewijs te veel ruimte in te nemen.
 */
export function OverMij() {
  const prefersReduced = usePrefersReducedMotion();
  /** Zelfde drempel als de foto: tekst en foto faden samen in/uit, in beide richtingen. */
  const revealed = useScrollTrigger(SCROLL_FADE_TRIGGER, MOBILE_SCROLL_FADE_TRIGGER);
  /** Verschijnen (omlaag) wacht tot hero eerst weg is; verdwijnen (omhoog) gaat meteen. */
  const photoOpacityTarget = revealed ? 1 : 0;
  const photoFadeDelay = photoOpacityTarget === 1 ? SCROLL_FADE_STAGGER : 0;

  return (
    <motion.section
      id="over"
      className="relative bg-wine text-white antialiased"
      variants={staggerParent}
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced || revealed ? "visible" : "hidden"}
    >
      <motion.div
        animate={{ opacity: prefersReduced ? 1 : photoOpacityTarget }}
        transition={{
          duration: SCROLL_TRIGGER_FADE_DURATION,
          ease: luxEase,
          delay: prefersReduced ? 0 : photoFadeDelay,
        }}
        className="absolute inset-x-0 top-0 z-10 flex -translate-y-[33%] justify-center px-6"
      >
        <div className="relative aspect-[3/4] w-[clamp(18rem,21vw,32.2rem)]">
          <Image
            src="/images/vera-portrait-sunny.png"
            alt="Vera, keramist en maker achter Veramiek"
            fill
            sizes="(min-width: 768px) 21vw, 85vw"
            className="object-cover"
          />
          <h2 className="absolute inset-x-0 top-0 -translate-y-1/2 text-center font-display text-[clamp(4rem,10vw,10rem)] leading-[0.85] font-bold tracking-[0.02em] text-white select-none">
            VERA
          </h2>
        </div>
      </motion.div>

      <div className="pt-[22rem] pb-28 md:pt-[34rem] md:pb-36">
        <RevealItem>
          <p className="text-center font-body text-sm tracking-[0.25em] text-sage">
            De Keramist
          </p>
        </RevealItem>

        <RevealItem>
          <p className="mx-auto mt-6 max-w-[46rem] text-center font-display text-3xl leading-snug tracking-[0.02em] text-white md:text-4xl">
            Met je handen werken is bijna magisch: je wordt één met de klei,
            komt volledig tot rust en je creëert iets dat blijft.
          </p>
        </RevealItem>

        <RevealItem>
          <div className="mx-auto mt-24 grid w-[85%] max-w-[100rem] gap-16 md:grid-cols-2 md:gap-24">
            <div className="space-y-8 text-lg text-white/85">
              <p>
                Ik ben Vera, 26 jaar oud, keramist en maker achter Veramiek.
                Samen met mijn partner Kenny en onze nieuwsgierige hond Ollie
                woon ik in Etten-Leur. Ollie loopt regelmatig rond in mijn
                atelier en is altijd erg nieuwsgierig wat ik daar nou allemaal
                aan het doen ben, dus grote kans dat je hem af en toe voorbij
                ziet komen op mijn website of socials. Hij is mijn kleine
                sidekick en grootste supporter.
              </p>
              <p>
                Mijn atelier is de plek waar ik tot rust kom. Hier ontstaan
                unieke, handgemaakte keramiekstukken, gemaakt met aandacht,
                geduld en liefde voor het ambacht. De stukken die ik maak zijn
                bedoeld om generaties lang mee te gaan en een mooi plekje te
                krijgen in jouw huis.
              </p>
              <p>
                Ik verkoop mijn collecties online, sta op verschillende
                markten en geef workshops waarin ik mensen laat ervaren hoe
                bijzonder het is om iets met je eigen handen te creëren.
              </p>

              <blockquote className="border-l border-sage/70 pl-8 font-display text-2xl leading-snug tracking-[0.04em] italic">
                Het werken met klei bracht rust, focus en plezier terug in
                mijn leven.
              </blockquote>

              <p>
                Keramiek is voor mij meer dan een ambacht. Het is een manier
                om te vertragen, om offline te zijn en om te voelen hoe het is
                om zelf iets te maken.
              </p>
              <p>
                Ik geloof dat creativiteit en ambacht goed zijn voor je
                mentale gezondheid. Voor mij is het een plek waar ik mezelf
                terugvind, en dat is precies wat ik wil doorgeven via mijn
                werk en workshops.
              </p>
            </div>

            <div>
              <div className="relative mx-auto aspect-[3/4] w-[58%]">
                <Image
                  src="/images/vera-draaischijf.png"
                  alt="Vera aan de draaischijf in haar atelier"
                  fill
                  sizes="(min-width: 768px) 36vw, 72vw"
                  className="object-cover"
                />
              </div>
              <div aria-hidden className="mx-auto mt-8 h-px w-10 bg-sage/60" />
              <p className="mx-auto mt-6 max-w-[58%] font-display text-xl leading-snug tracking-[0.02em] text-white italic">
                Een tijd geleden zat ik niet goed in mijn vel. Ik voelde druk
                om carrière te maken zoals mensen om me heen dat deden, maar
                wist niet wat mijn eigen pad was. Toen kwam ik een cursus
                pottenbakken tegen. Voor velen maar iets kleins, maar het
                raakte meteen iets in mij.
              </p>
              <p className="mx-auto mt-3 max-w-[58%] text-sm tracking-[0.05em] text-white/60">
                Aan de draaischijf in het atelier, Etten-Leur.
              </p>
            </div>
          </div>
        </RevealItem>
      </div>
    </motion.section>
  );
}
