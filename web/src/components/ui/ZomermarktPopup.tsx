"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, X } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { luxEase, menuTransition } from "@/lib/motion";

/**
 * Tijdelijke aankondiging voor de Zwoele Zomermarkt bij STEK Breda,
 * zaterdag 22 augustus 2026.
 *
 * Na de markt kan dit bestand weg, samen met de regel in layout.tsx en
 * public/images/zomermarkt.jpg. Tot die tijd stopt de component zichzelf:
 * voorbij EINDE rendert hij niets meer.
 */

/** Einde van de markt, in lokale tijd (CEST). */
const EINDE = new Date("2026-08-22T21:00:00+02:00");
/** Onthoudt dat iemand hem al gezien heeft. */
const OPSLAG_SLEUTEL = "veramiek-zomermarkt-2026";
const VERTRAGING_MS = 2500;

/**
 * localStorage gooit een SecurityError in de privemodus van iOS. Zonder
 * afscherming zou die ene fout de hele component laten crashen, dus alle
 * toegang loopt via deze twee functies.
 */
function alGezien(): boolean {
  try {
    return window.localStorage.getItem(OPSLAG_SLEUTEL) === "1";
  } catch {
    return false;
  }
}

function onthoud(): void {
  try {
    window.localStorage.setItem(OPSLAG_SLEUTEL, "1");
  } catch {
    /* Geen opslag beschikbaar: hij verschijnt bij het volgende bezoek opnieuw. */
  }
}

export function ZomermarktPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const panelRef = useDialogFocus<HTMLDivElement>(isOpen, () => setIsOpen(false));

  useEffect(() => {
    if (Date.now() >= EINDE.getTime() || alGezien()) return;

    const timer = window.setTimeout(() => {
      /*
       * Meteen bij openen onthouden, niet pas bij sluiten. Anders krijgt
       * iemand die doorklikt naar een productpagina hem daar opnieuw.
       */
      onthoud();
      setIsOpen(true);
    }, VERTRAGING_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const paneelVerborgen = prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14 };
  const paneelZichtbaar = prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={menuTransition}
        >
          <button
            type="button"
            aria-label="Melding sluiten"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-wine/45 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="zomermarkt-titel"
            tabIndex={-1}
            initial={paneelVerborgen}
            animate={paneelZichtbaar}
            exit={paneelVerborgen}
            transition={{ duration: 0.42, ease: luxEase }}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-[30rem] overflow-y-auto bg-white px-6 pt-9 pb-7 text-wine sm:max-h-[calc(100vh-2.5rem)] sm:px-10 sm:pt-11 sm:pb-10"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Sluiten"
              className="absolute top-4 right-4 cursor-pointer p-1 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {/*
             * De poster is roze met grasgroen en botst met wine en sage.
             * Daarom niet paneelvullend, maar met witruimte en een sage
             * haarlijn eromheen, zodat hij als flyer leest en niet als
             * onderdeel van de site.
             *
             * Op een telefoon een vaste verhouding 579:270 in plaats van een
             * vaste pixelhoogte: anders hangt van de schermbreedte af hoeveel
             * van de poster je ziet en snijdt de rand dwars door de regel
             * "16:00-21:00". Zo valt de snede altijd net onder de tijd.
             * Vanaf sm is de poster weer heel, met 40vh als vangnet voor een
             * laag venster (liggende telefoon, klein laptopscherm).
             */}
            <Image
              src="/images/zomermarkt.jpg"
              alt="Poster van de Zwoele Zomermarkt op zaterdag 22 augustus 2026, van 16:00 tot 21:00"
              width={579}
              height={386}
              className="mb-5 aspect-[579/270] h-auto w-full border border-sage/90 object-cover object-top sm:mb-7 sm:aspect-auto sm:max-h-[40vh]"
              priority
            />

            <h2
              id="zomermarkt-titel"
              className="mb-3 font-display text-2xl leading-[1.25] tracking-[0.02em] sm:mb-4 sm:text-3xl"
            >
              Veramiek staat op de Zwoele Zomermarkt
            </h2>

            <p className="opacity-85">
              Zaterdag 22 augustus van 16:00 tot 21:00 bij STEK aan de
              Veilingkade in Breda. Kom het keramiek in het echt zien.
            </p>

            <p className="mt-5 flex items-center gap-4 border-t border-sage/70 pt-4 sm:mt-7 sm:pt-5">
              <MapPin size={21} strokeWidth={1.5} className="shrink-0 text-sage" />
              <span>STEK, Veilingkade 9A, Breda</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
              <CtaButton
                href="https://www.google.com/maps/search/?api=1&query=STEK+Veilingkade+9A+Breda"
                external
              >
                Bekijk de route
              </CtaButton>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex cursor-pointer items-center rounded-full border border-wine px-8 py-3 text-base tracking-[0.03em] whitespace-nowrap transition-[background-color,color] duration-300 hover:bg-wine hover:text-white active:scale-[0.98]"
              >
                Sluiten
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
