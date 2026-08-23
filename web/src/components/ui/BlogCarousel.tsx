"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/api";
import { luxEase } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const AUTOPLAY_MS = 7000;

/**
 * CSS-tegenhanger van luxEase uit lib/motion. Het aangeleverde voorbeeld had
 * hier een easing die doorschiet en terugveert; dat past niet bij de rustige
 * toon van de site, dus de foto's remmen nu gelijkmatig af.
 */
const LUX_EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Breedte van één foto, als deel van de stage. Kleiner dan de stage, anders
 * verdwijnen de buurfoto's volledig achter de actieve en zie je alleen een
 * randje uitsteken.
 */
const CARD_WIDTH = 0.65;
/** Zijdelingse verschuiving van de buurfoto's, ook als deel van de stage. */
const CARD_OFFSET = 0.245;
/** Hoe ver de buurfoto's terugtreden. */
const CARD_SCALE = 0.78;

/**
 * Staande foto's in een liggend kader worden bijgesneden; objectPosition
 * bepaalt welk deel behouden blijft (zelfde patroon als accordionObjectPosition
 * bij de collecties).
 */
export type CarouselItem = Pick<
  BlogPost,
  "title" | "excerpt" | "image" | "alt" | "meta"
> & {
  objectPosition?: string;
  /**
   * Doel van "Lees verder", per blog. Zonder link vervalt de knop, zodat een
   * post zonder artikel niet naar de verkeerde pagina wijst.
   */
  href?: string;
};

type BlogCarouselProps = {
  posts: CarouselItem[];
  autoplay?: boolean;
  /** Volgt de achtergrond: "dark" = wijnrood op wit, "light" = wit op wijnrood. */
  tone?: "dark" | "light";
};

const arrowClasses: Record<NonNullable<BlogCarouselProps["tone"]>, string> = {
  dark: "border-wine text-wine hover:bg-wine hover:text-white",
  light: "border-white text-white hover:bg-white hover:text-wine",
};

/**
 * Dunne omlijning om de foto's. Op wit is dat een sage haarlijn, wat de
 * Whisper Rule toestaat (sage alleen als dunne lijn); op wijnrood zou sage te
 * hard contrasteren, daar staat een ingehouden witte lijn.
 */
const frameClasses: Record<NonNullable<BlogCarouselProps["tone"]>, string> = {
  dark: "border-sage/70",
  light: "border-white/25",
};

/**
 * Blogcarrousel: drie foto's naast elkaar met de actieve scherp en groot in het
 * midden, en de vorige en volgende kleiner, vager en onscherp ernaast. Alle drie
 * de bovenranden liggen op één lijn. Rechts staan de titel, het meta-label en de
 * tekst van de actieve blog.
 *
 * Bewust afgeweken van het aangeleverde voorbeeld, om binnen het designsysteem
 * te blijven (zie DESIGN.md en globals.css):
 * - dunne omlijning, zacht afgeronde hoeken (rounded-2xl) en een lage schaduw,
 *   alle drie op verzoek van Kenny. LET OP: de schaduw is een bewuste
 *   uitzondering op de Flat Gallery Rule uit globals.css, die box-shadow overal
 *   verbiedt en de shadow-tokens op 0 zet. Daarom een expliciete waarde met
 *   Deep Wine in plaats van zwart, en niet de shadow-utility (die doet niets).
 *   Dit en de afgeronde hoeken zijn de eerste van hun soort in het project.
 * - geen kleur- en fontgrootte-props, maar de vaste drie kleurrollen en de
 *   type-schaal met 19px-ondergrens, zodat de Gruppo-leesbaarheid geborgd blijft
 */
export function BlogCarousel({
  posts,
  autoplay = true,
  tone = "dark",
}: BlogCarouselProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [paused, setPaused] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const total = posts.length;
  /* Bij een lege of gekrompen lijst zou posts[activeIndex] undefined zijn en
     verderop op .meta stuklopen. Terugvallen op de eerste is genoeg; is die er
     ook niet, dan rendert de component onderaan niets. */
  const active = posts[activeIndex] ?? posts[0];

  useEffect(() => {
    const element = imageContainerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Autoplay staat uit zolang de bezoeker er met muis of toetsenbord in zit, en
  // helemaal bij prefers-reduced-motion. Handmatig bladeren zet de timer terug
  // op nul in plaats van hem definitief te doden.
  useEffect(() => {
    if (!autoplay || prefersReduced || paused || total < 2) return;
    const timer = window.setInterval(
      () => setActiveIndex((prev) => (prev + 1) % total),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [autoplay, prefersReduced, paused, total, activeIndex]);

  const goTo = useCallback(
    (step: number) => setActiveIndex((prev) => (prev + step + total) % total),
    [total],
  );

  /**
   * Pijltjestoetsen luisteren op de carrousel zelf, niet op window: anders
   * kaapt dit component de pijltjes van de hele pagina, inclusief scrollen.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(1);
    }
  };

  /* Na alle hooks, zodat de volgorde gelijk blijft: zonder artikelen valt er
     niets te tonen. Gebeurt in de praktijk alleen als de API wegvalt. */
  if (!active) return null;

  function imageStyle(index: number): React.CSSProperties {
    const gap = containerWidth * CARD_OFFSET;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + total) % total === index;
    const isRight = (activeIndex + 1) % total === index;
    const transition = prefersReduced ? "none" : `all 1.15s ${LUX_EASE_CSS}`;

    // Alles schaalt vanaf de bovenrand, zodat de bovenkanten van de drie foto's
    // op één lijn liggen. Zonder dit zakt een geschaalde foto naar het midden en
    // loopt de bovenrand alsnog niet gelijk.
    const transformOrigin = "top center";

    // De kaarten staan op left-1/2 met een vaste breedte, dus het centreren
    // (-50%) hoort in de transform: een Tailwind-klasse wordt hier overschreven.
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        // Expliciet blur(0px) en niet weglaten: anders is er geen waarde om
        // vanaf te animeren en springt de scherpte er in één keer in.
        filter: "blur(0px)",
        transform: "translateX(-50%) scale(1)",
        transformOrigin,
        transition,
      };
    }
    // De twee die achterin liggen treden terug: kleiner, minder dekkend, onscherp.
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.4,
        filter: "blur(4px)",
        transform: `translateX(calc(-50% - ${gap}px)) scale(${CARD_SCALE})`,
        transformOrigin,
        transition,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.4,
        filter: "blur(4px)",
        transform: `translateX(calc(-50% + ${gap}px)) scale(${CARD_SCALE})`,
        transformOrigin,
        transition,
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      filter: "blur(4px)",
      transform: `translateX(-50%) scale(${CARD_SCALE})`,
      transformOrigin,
      transition,
    };
  }

  return (
    <div
      role="group"
      aria-roledescription="carrousel"
      aria-label="Blogs van Veramiek"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="mx-auto grid w-full max-w-7xl gap-10 outline-none md:grid-cols-[1.7fr_1fr] md:items-center md:gap-16"
    >
      {/* Geen perspective meer: de foto's staan recht, zonder 3D-kanteling. */}
      <div ref={imageContainerRef} className="relative aspect-[1.85/1] w-full">
        {posts.map((post, index) => (
          <div
            key={post.image}
            aria-hidden={index !== activeIndex}
            className={`absolute top-0 left-1/2 h-full overflow-hidden rounded-2xl border shadow-[0_18px_40px_-24px_rgba(47,4,16,0.5)] ${frameClasses[tone]}`}
            style={{ width: `${CARD_WIDTH * 100}%`, ...imageStyle(index) }}
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              sizes="(min-width: 768px) 30rem, 100vw"
              className="object-cover"
              style={{ objectPosition: post.objectPosition ?? "center" }}
            />
          </div>
        ))}
      </div>

      {/* z-10: de zijfoto's steken buiten hun kolom en mogen niet over de tekst vallen. */}
      <div className="relative z-10 flex flex-col">
        {/*
         * Alle tekstblokken liggen in dezelfde grid-cel: de onzichtbare kopieën
         * houden de hoogte van het langste item vast, de zichtbare ligt erover.
         * Zonder dit klapt de kolom leeg tijdens de wissel (mode="wait" haalt het
         * oude blok weg voordat het nieuwe komt) en verspringt de pagina.
         */}
        <div className="grid">
          {posts.map((post, index) => (
            <div
              key={`sizer-${post.image}`}
              aria-hidden
              className="invisible [grid-area:1/1]"
            >
              <p className="text-base tracking-[0.22em] uppercase">{post.meta}</p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">
                {post.title}
              </h3>
              <div className="mt-5 h-px w-12 md:mt-8" />
              {/* Zelfde opmaak als hieronder: losse inline-block woorden breken
                  anders af dan doorlopende tekst, en dan klopt de hoogte niet. */}
              <p className="mt-5 text-base leading-[1.7] md:mt-8 md:text-lg md:leading-[1.75]">
                {post.excerpt.split(" ").map((word, i) => (
                  <span key={`${index}-${i}`} className="inline-block">
                    {word}&nbsp;
                  </span>
                ))}
              </p>
            </div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: luxEase }}
              aria-live="polite"
              className="[grid-area:1/1]"
            >
              <p className="text-base tracking-[0.22em] uppercase opacity-55">
                {active.meta}
              </p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">
                {active.title}
              </h3>
              <div aria-hidden className="mt-5 h-px w-12 bg-sage/70 md:mt-8" />
              <p className="mt-5 text-base leading-[1.7] opacity-85 md:mt-8 md:text-lg md:leading-[1.75]">
                {prefersReduced
                  ? active.excerpt
                  : active.excerpt.split(" ").map((word, i) => (
                      <motion.span
                        key={`${activeIndex}-${i}`}
                        initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: luxEase, delay: 0.025 * i }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-4 md:mt-8 md:gap-6">
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Vorige blog"
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 ${arrowClasses[tone]}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Volgende blog"
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 ${arrowClasses[tone]}`}
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {active.href ? (
            <Link
              href={active.href}
              className="ml-auto text-base tracking-[0.03em] underline underline-offset-8 opacity-85 transition-colors hover:text-sage hover:opacity-100"
            >
              Lees verder
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
