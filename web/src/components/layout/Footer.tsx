import Image from "next/image";
import Link from "next/link";
import { contact, footerLinks } from "@/lib/content";

/**
 * Minimalistische witte footer als adempauze onder het wijnrode vlak:
 * donker logo, één rij links, en een dunne Pastel Groen haarlijn bovenaan
 * (Whisper Rule als lijn).
 */
export function Footer() {
  return (
    <footer className="border-t border-sage/40 bg-white text-wine antialiased">
      <div className="flex flex-col items-center gap-10 px-6 py-20 md:py-24">
        <Image
          src="/logo/logo-horizontal.png"
          alt="Veramiek"
          width={520}
          height={130}
          className="h-10 w-auto"
        />

        <nav aria-label="Footernavigatie">
          {/* footerLinks in plaats van navLinks: /blog stond alleen in het
              mobiele menu en in de sitemap, waardoor de blogartikelen vanaf
              desktop nergens vandaan een interne link kregen. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base tracking-[0.03em] opacity-80 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base tracking-[0.03em] opacity-80 transition-opacity hover:opacity-100"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm opacity-60">
          <span>
            &copy; {new Date().getFullYear()} Veramiek. Handgemaakt keramiek.
          </span>
          <span aria-hidden>&middot;</span>
          <Link
            href="/privacy"
            className="transition-opacity hover:opacity-100"
          >
            Privacybeleid
          </Link>
          <span aria-hidden>&middot;</span>
          <span>
            Ontwikkeld door{" "}
            <a
              href="https://versodevelopment.nl"
              target="_blank"
              rel="noopener"
              className="transition-opacity hover:opacity-100"
            >
              Verso
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
