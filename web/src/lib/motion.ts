import type { Variants } from "motion/react";

/** Luxe, rustige easing voor alle scroll-reveals. */
export const luxEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealDuration = 0.9;

/** Standaard fade-in voor secties: subtiele opacity + kleine translateY. */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    transition: { duration: revealDuration, ease: luxEase },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: revealDuration, ease: luxEase },
  },
};

/** Parent-variant voor secties waarvan de kinderen gestaffeld verschijnen. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Snelle open/dicht-animatie voor UI-affordances zoals het megamenu. */
export const menuTransition = { duration: 0.18, ease: luxEase } as const;

/**
 * Scroll-getriggerde (niet scroll-gekoppelde) reveals op de homepage: bij een
 * vaste scrollY-drempel start eenmalig een tijdgestuurde animatie die
 * afloopt ongeacht verder scrollgedrag. 1 "scroll" = 100px.
 *
 * Hero-tekst en Vera-foto delen dezelfde drempel (anders zit er een stuk
 * scroll tussen waar geen van beide iets toont) en worden alleen in tijd na
 * elkaar gezet, in beide richtingen: wie verdwijnt begint meteen (delay 0),
 * wie verschijnt wacht op SCROLL_FADE_STAGGER. Bij scroll omlaag: hero
 * verdwijnt meteen, Vera verschijnt met de stagger erna. Bij scroll omhoog
 * (terug): Vera verdwijnt meteen, hero verschijnt met de stagger erna.
 */
export const SCROLL_UNIT = 100;
/** Zowel hero-tekst als Vera-foto reageren op deze ene scrolldrempel (scroll 5). */
export const SCROLL_FADE_TRIGGER = SCROLL_UNIT * 5;
/** Duur van beide getriggerde fades. Kort, anders mis je 'm bij hard scrollen. */
export const SCROLL_TRIGGER_FADE_DURATION = 0.6;
/** Wachttijd voor wie verschijnt, zodat wie verdwijnt eerst op gang is. */
export const SCROLL_FADE_STAGGER = 0.25;
