"use client";

import { ChevronDown } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { contact } from "@/lib/content";
import { fadeUp, luxEase, revealDuration, staggerParent } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** Ms zonder scrollen voordat het "Scroll"-label naast de pijl verschijnt. */
const SCROLL_HINT_IDLE_MS = 5000;

const HEADING = "Handgemaakte Keramiek";

/** Nest-stagger voor de losse letters van de heading (zelfde luxEase, korte cadans). */
const letterContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.02 } },
};
const letterItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: luxEase } },
};

/** Sage-lijntje groeit van links, zelfde timing-tokens als de rest van de site. */
const dividerVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: revealDuration, ease: luxEase },
  },
};

/**
 * Video als hero op een wijnrode achtergrond, geen foto en geen
 * scroll-animatie meer. De video staat op 70%, gecentreerd, zodat de
 * wijnrode achtergrond er als rand omheen zichtbaar blijft. Het tekstblok
 * begint links in die wijnrode rand en loopt door over de video; alle
 * tekst/iconen/knop zijn wit. Het tekstblok speelt bij het laden een
 * gestaffelde entree (kicker → heading-letters → divider → quote → knop,
 * via `staggerParent`/`fadeUp` uit lib/motion.ts, mount-getriggerd i.p.v.
 * scroll-getriggerd zoals `RevealSection`). Bij reduced motion: alles
 * statisch, geen autoplay en geen bounce op de scroll-pijl.
 *
 * Eerdere opzet (terug te vinden in git-historie): scroll-expansie hero met
 * de atelierfoto (studio-hero.webp) als achtergrond en deze zelfde video
 * klein in het midden, die tijdens het scrollen uitgroeide tot volledige
 * viewport (via Motion's useScroll/useTransform op mediaWidth/mediaHeight).
 * Bestand /videos/hero-small.mp4 (bron: 0707.mp4) is dat "kleine" videootje.
 */
export function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowScrollHint(true),
      SCROLL_HINT_IDLE_MS,
    );
    const onScroll = () => {
      setShowScrollHint(false);
      window.clearTimeout(timer);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-wine">
      <video
        src="/videos/hero-breda.mp4"
        autoPlay={!prefersReduced}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 object-cover"
      />

      {/* Zachte wijnrode scrim achter het tekstblok, zodat de witte tekst leesbaar blijft
          ongeacht wat er op dat moment in de video te zien is. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-10 w-full max-w-lg bg-gradient-to-r from-wine via-wine/70 to-transparent md:max-w-xl lg:max-w-2xl"
      />

      <div className="absolute inset-0 z-20 flex items-center">
        {prefersReduced ? (
          <div className="max-w-lg px-6 md:max-w-xl md:px-12 lg:max-w-2xl lg:px-16">
            <p className="text-sm tracking-[0.2em] text-sage uppercase md:text-base">
              Sinds 2025
            </p>
            <h1 className="mt-4 text-6xl text-white sm:text-7xl md:text-8xl">
              {HEADING}
            </h1>
            <div aria-hidden className="mt-8 h-px w-16 bg-sage md:mt-10" />
            <p className="mt-8 max-w-[34ch] text-3xl leading-relaxed text-white/90 md:mt-10 md:text-4xl">
              &ldquo;Met de hand gemaakt, met het hart gebakken. Om generaties
              lang mee te gaan.&rdquo;
            </p>
            <CtaButton
              href="/#collecties"
              variant="sageFillOnWine"
              size="lg"
              className="mt-12 md:mt-16"
            >
              Bekijk mijn collecties
            </CtaButton>
          </div>
        ) : (
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="visible"
            className="max-w-lg px-6 md:max-w-xl md:px-12 lg:max-w-2xl lg:px-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm tracking-[0.2em] text-sage uppercase md:text-base"
            >
              Sinds 2025
            </motion.p>
            <motion.h1
              aria-label={HEADING}
              variants={letterContainer}
              className="mt-4 text-6xl text-white sm:text-7xl md:text-8xl"
            >
              {HEADING.split(" ").flatMap((word, wi, words) => {
                const wordSpan = (
                  <span
                    key={`w-${wi}`}
                    aria-hidden
                    className="inline-block whitespace-nowrap"
                  >
                    {word.split("").map((char, ci) => (
                      <motion.span
                        key={ci}
                        variants={letterItem}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                );
                return wi < words.length - 1 ? [wordSpan, " "] : [wordSpan];
              })}
            </motion.h1>
            <motion.div
              aria-hidden
              variants={dividerVariants}
              className="mt-8 h-px w-16 origin-left bg-sage md:mt-10"
            />
            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[34ch] text-3xl leading-relaxed text-white/90 md:mt-10 md:text-4xl"
            >
              &ldquo;Met de hand gemaakt, met het hart gebakken. Om generaties
              lang mee te gaan.&rdquo;
            </motion.p>
            <motion.div variants={fadeUp} className="mt-12 md:mt-16">
              <CtaButton
                href="/#collecties"
                variant="sageFillOnWine"
                size="lg"
              >
                Bekijk mijn collecties
              </CtaButton>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="absolute right-6 bottom-8 z-20 flex items-center gap-8 md:right-12 md:bottom-10">
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Veramiek op Instagram"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-sage"
        >
          <InstagramIcon className="h-12 w-12" />
        </a>
        <a
          href={contact.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Veramiek op TikTok"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-sage"
        >
          <TikTokIcon className="h-12 w-12" />
        </a>
        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur Veramiek een WhatsApp-bericht"
          className="-m-2 p-2 text-white transition-[transform,color] duration-300 ease-out hover:scale-[1.08] hover:text-sage"
        >
          <WhatsAppIcon className="h-12 w-12" />
        </a>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-sage md:bottom-10"
      >
        <span
          className={`text-xs tracking-[0.2em] uppercase transition-opacity duration-500 ${
            showScrollHint ? "opacity-100" : "opacity-0"
          }`}
        >
          Scroll
        </span>
        <ChevronDown
          className={`h-6 w-6 ${prefersReduced ? "" : "animate-[soft-drift_2.2s_ease-in-out_infinite]"}`}
        />
      </div>
    </section>
  );
}
