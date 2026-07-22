"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { contact } from "@/lib/content";
import { introHasPlayed } from "@/lib/introPlayed";
import {
  luxEase,
  SCROLL_FADE_STAGGER,
  SCROLL_FADE_TRIGGER,
  SCROLL_TRIGGER_FADE_DURATION,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { INTRO_TOTAL_MS } from "./LoadIntro";

/** Tekst/iconen faden al in tijdens de laatste fase van de LoadIntro-panelen. */
const TEXT_INTRO_DELAY = (INTRO_TOTAL_MS - 100) / 1000;
/** VERAMIEK verschijnt eerst; de rest volgt na deze extra stagger. */
const TEXT_INTRO_STAGGER = 0.3;
/** Trager, rustiger fade-in dan de standaard 0.7s. */
const TEXT_FADE_DURATION = 1.3;

/**
 * Video vult het volledige scherm, met een subtiele donkere multiply-filter
 * voor leesbaarheid die de kleurintensiteit van de video behoudt. Linksonder
 * staat het grote VERAMIEK-wordmark (uitgerekt met scaleY voor extra hoogte),
 * met rechts ervan op ooghoogte met de bovenkant een korte tagline in drie
 * regels, en direct eronder, over de breedte van het woord, een rij met drie
 * collectienamen (begin/midden/einde). Social iconen rechtsonder ongewijzigd.
 * Alle tekst/iconen faden pas in nadat de LoadIntro-panelen (zie LoadIntro.tsx)
 * volledig zijn weggetrokken, VERAMIEK eerst, dan de rest gestaffeld erachteraan.
 */
export function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  /**
   * Bij een terugnavigatie draait de LoadIntro niet opnieuw, dus dan mag de
   * herotekst er ook niet meer op wachten: die staat er dan meteen.
   */
  const [skipIntro] = useState(introHasPlayed);
  const instant = prefersReduced || skipIntro;
  const introDelay = instant ? 0 : TEXT_INTRO_DELAY;
  const introDelayLate = instant ? 0 : TEXT_INTRO_DELAY + TEXT_INTRO_STAGGER;
  const textFadeTriggered = useScrollTrigger(SCROLL_FADE_TRIGGER);
  /** Verdwijnen (omlaag) gaat meteen; terugkomen (omhoog) wacht tot Vera eerst weg is. */
  const textOpacityTarget = textFadeTriggered ? 0 : 1;
  const textFadeDelay = textOpacityTarget === 1 ? SCROLL_FADE_STAGGER : 0;

  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-wine">
      <video
        src="/videos/hero-breda-warmrays.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay={!prefersReduced}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center"
      />

      {/* Multiply behoudt de kleurintensiteit van de video, i.t.t. een platte zwarte scrim. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-black/30 mix-blend-multiply"
      />

      <motion.div
        animate={{ opacity: prefersReduced ? 1 : textOpacityTarget }}
        transition={{
          duration: SCROLL_TRIGGER_FADE_DURATION,
          ease: luxEase,
          delay: prefersReduced ? 0 : textFadeDelay,
        }}
        className="absolute bottom-24 left-5 z-20 inline-block sm:bottom-8 sm:left-6 md:bottom-10 md:left-12"
      >
        <motion.p
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: TEXT_FADE_DURATION, ease: luxEase, delay: introDelay }}
          className="origin-bottom-left scale-y-125 font-display text-[clamp(3.7rem,16vw,18rem)] leading-[0.9] font-bold tracking-[0.05em] text-white sm:text-[clamp(7rem,11.8vw,18rem)]"
        >
          VERAMIEK
        </motion.p>

        <motion.span
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: TEXT_FADE_DURATION,
            ease: luxEase,
            delay: introDelayLate,
          }}
          className="mt-4 block font-body text-[0.85rem] leading-[1.6] tracking-[0.08em] text-white md:absolute md:top-0 md:left-full md:mt-0 md:ml-6 md:block md:whitespace-nowrap"
        >
          Met de hand gemaakt,
          <br />
          met het hart gebakken.
          <br />
          Om generaties lang mee te gaan.
        </motion.span>

        <motion.div
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: TEXT_FADE_DURATION,
            ease: luxEase,
            delay: introDelayLate,
          }}
          className="mt-5 flex w-full items-center justify-between gap-4 font-body text-[0.78rem] tracking-[0.08em] text-white sm:text-[1rem]"
        >
          <span>Zeeuws Zand</span>
          <span>Kust Koraal</span>
          <span>Boeren Bontjes</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: TEXT_FADE_DURATION,
          ease: luxEase,
          delay: introDelayLate,
        }}
        className="absolute right-5 bottom-8 z-20 flex items-center gap-5 sm:right-6 sm:gap-8 md:right-12 md:bottom-10"
      >
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Veramiek op Instagram"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-wine"
        >
          <InstagramIcon className="h-12 w-12" />
        </a>
        <a
          href={contact.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Veramiek op TikTok"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-wine"
        >
          <TikTokIcon className="h-12 w-12" />
        </a>
        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur Veramiek een WhatsApp-bericht"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-wine"
        >
          <WhatsAppIcon className="h-12 w-12" />
        </a>
      </motion.div>
    </section>
  );
}
