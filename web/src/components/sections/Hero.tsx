"use client";

import { motion } from "motion/react";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { contact } from "@/lib/content";
import { luxEase } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
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

  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-wine">
      <video
        src="/videos/hero-breda-warmrays.mp4"
        autoPlay={!prefersReduced}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Multiply behoudt de kleurintensiteit van de video, i.t.t. een platte zwarte scrim. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-black/30 mix-blend-multiply"
      />

      <div className="absolute bottom-8 left-6 z-20 inline-block md:bottom-10 md:left-12">
        <motion.p
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: TEXT_FADE_DURATION, ease: luxEase, delay: TEXT_INTRO_DELAY }}
          className="origin-bottom-left scale-y-125 font-display text-[clamp(7rem,22vw,18rem)] leading-[0.9] font-bold tracking-[0.05em] text-white"
        >
          VERAMIEK
        </motion.p>

        <motion.span
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: TEXT_FADE_DURATION,
            ease: luxEase,
            delay: TEXT_INTRO_DELAY + TEXT_INTRO_STAGGER,
          }}
          className="absolute top-0 left-full ml-6 font-body text-[0.85rem] leading-[1.6] tracking-[0.08em] whitespace-nowrap text-white"
        >
          Met de hand gemaakt,
          <br />
          met het hart gebakken.
          <br />
          Om generaties lang mee te gaan.
        </motion.span>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: TEXT_FADE_DURATION,
            ease: luxEase,
            delay: TEXT_INTRO_DELAY + TEXT_INTRO_STAGGER,
          }}
          className="mt-5 flex w-full items-center justify-between font-body text-[1rem] tracking-[0.08em] text-white"
        >
          <span>Dune &amp; Dust</span>
          <span>Blush</span>
          <span>Boeren bontjes</span>
        </motion.div>
      </div>

      <motion.div
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: TEXT_FADE_DURATION,
          ease: luxEase,
          delay: TEXT_INTRO_DELAY + TEXT_INTRO_STAGGER,
        }}
        className="absolute right-6 bottom-8 z-20 flex items-center gap-8 md:right-12 md:bottom-10"
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
