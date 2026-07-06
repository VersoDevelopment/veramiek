import { CtaButton } from "@/components/ui/CtaButton";
import { RevealSection } from "@/components/ui/RevealSection";
import { contact } from "@/lib/content";

/**
 * Minimale contactsectie: geen formulier. WhatsApp is de grootste knop,
 * e-mail en Instagram zijn kleinere secundaire opties (placeholders).
 */
export function ContactCta() {
  return (
    <RevealSection id="contact" className="bg-white px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl">Iets moois in gedachten?</h2>
        <p className="mt-8 max-w-[42ch] text-base opacity-85">
          Stuur een bericht, ik denk graag met je mee.
        </p>
        <CtaButton
          href={contact.whatsappUrl}
          external
          size="lg"
          className="mt-10"
        >
          Stuur mij een WhatsApp
        </CtaButton>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <CtaButton href={`mailto:${contact.email}`} variant="outline">
            E-mail
          </CtaButton>
          <CtaButton href={contact.instagramUrl} external variant="outline">
            Instagram
          </CtaButton>
        </div>
      </div>
    </RevealSection>
  );
}
