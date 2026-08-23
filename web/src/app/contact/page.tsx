import type { Metadata } from "next";
import { Home } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { EmailAction } from "@/components/ui/EmailAction";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { getContent } from "@/lib/api";
import { contact as fallback } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Een vraag over mijn werk, een maatwerkwens of een workshop boeken? Stuur een bericht, ik denk graag met je mee.",
  alternates: { canonical: "/contact" },
};

/*
 * `?over=<productnaam>` komt van de aanvraagknop bij een uitverkocht stuk.
 * Het onderwerp staat dan al ingevuld, zodat Vera meteen ziet waar het over
 * gaat en de bezoeker niets hoeft over te typen.
 */
type Props = { searchParams: Promise<{ over?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { over } = await searchParams;
  const startOnderwerp = over ? `Aanvraag: ${over.slice(0, 120)}` : "";
  const content = await getContent();
  const c = content.contact ?? {};

  const whatsappUrl = c.whatsappUrl ?? fallback.whatsappUrl;
  const email = c.email ?? fallback.email;
  const phone = c.phone ?? "";
  const location = c.location ?? "Etten-Leur, Noord-Brabant";
  const instagramUrl = c.instagramUrl ?? fallback.instagramUrl;
  const instagramHandle = c.instagramHandle ?? fallback.instagramHandle;
  const tiktokUrl = c.tiktokUrl ?? fallback.tiktokUrl;
  const tiktokHandle = c.tiktokHandle ?? "@veramiek";

  return (
    <section className="relative px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backgrounds/takken-wijnrood.webp)" }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl">
            {c.title ?? "Vragen of bestellen?"}
          </h1>
          <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
        </header>

        <div className="mt-8 grid gap-16 md:grid-cols-[1fr_1.3fr] md:gap-24">
          {/* Gegevens */}
          <div className="space-y-8">
            <p className="text-lg text-white/90">
              {c.desc ??
                "Heb je een vraag over mijn werk, wil je een maatwerkopdracht bespreken of een workshop boeken? Stuur me gerust een bericht, ik reageer zo snel mogelijk."}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 transition-opacity hover:opacity-70"
            >
              <WhatsAppIcon className="h-6 w-6 shrink-0 text-sage" />
              <span className="text-lg">
                {phone ? phone : "Stuur een WhatsApp"}
              </span>
            </a>

            <EmailAction email={email} label={email} variant="row" />

            <div className="flex items-center gap-4">
              <Home aria-hidden className="h-6 w-6 shrink-0 text-sage" />
              <span className="text-lg opacity-85">{location}</span>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${instagramHandle}`}
                className="flex items-center gap-4 transition-opacity hover:opacity-70"
              >
                <InstagramIcon className="h-6 w-6 shrink-0 text-sage" />
                <span className="text-lg">{instagramHandle}</span>
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`TikTok ${tiktokHandle}`}
                className="flex items-center gap-4 transition-opacity hover:opacity-70"
              >
                <TikTokIcon className="h-6 w-6 shrink-0 text-sage" />
                <span className="text-lg">{tiktokHandle}</span>
              </a>
            </div>
          </div>

          {/* Formulier op een witte adempauze-kaart (leesbaarheid) */}
          <div className="bg-white p-7 md:p-9">
            <ContactForm startOnderwerp={startOnderwerp} />
          </div>
        </div>
      </div>
    </section>
  );
}
