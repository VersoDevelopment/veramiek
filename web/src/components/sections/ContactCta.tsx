import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { EmailAction } from "@/components/ui/EmailAction";
import { RevealSection } from "@/components/ui/RevealSection";
import { contact } from "@/lib/content";

/**
 * Minimale contactsectie: geen formulier. WhatsApp is de grootste knop,
 * e-mail en Instagram zijn kleinere secundaire opties (placeholders).
 *
 * Staat op een wijnrode reliëfwand. Omdat de achtergrond donker is, gebruiken
 * tekst en knoppen hier de lichte varianten; de wijnrode primary/outline uit de
 * witte versie zou wegvallen tegen dit vlak.
 */
export function ContactCta() {
  return (
    <RevealSection
      id="contact"
      className="relative isolate overflow-hidden px-6 py-24 text-white antialiased md:py-32"
    >
      <Image
        src="/images/contact-wand-wijnrood.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Rustige sluier: houdt de tekst leesbaar boven het reliëf rechts in beeld. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-wine/45" />

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl">Iets moois in gedachten?</h2>
        <p className="mt-8 max-w-[42ch] text-base opacity-85">
          Stuur een bericht, ik denk graag met je mee.
        </p>
        <CtaButton
          href={contact.whatsappUrl}
          external
          size="lg"
          variant="light"
          className="mt-10"
        >
          Stuur mij een WhatsApp
        </CtaButton>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <EmailAction email={contact.email} />
          <CtaButton href={contact.instagramUrl} external variant="lightOutline">
            Instagram
          </CtaButton>
        </div>
      </div>
    </RevealSection>
  );
}
