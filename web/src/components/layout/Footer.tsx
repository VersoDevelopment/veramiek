import Image from "next/image";
import Link from "next/link";
import { contact, navLinks } from "@/lib/content";

/**
 * Minimalistische footer op Deep Wine: wit logo, één rij links,
 * en een dunne Pastel Groen haarlijn (Whisper Rule als lijn).
 */
export function Footer() {
  return (
    <footer className="border-t border-sage/30 bg-wine text-white antialiased">
      <div className="flex flex-col items-center gap-10 px-6 py-20 md:py-24">
        <Image
          src="/logo/logo-horizontal-white.png"
          alt="Veramiek"
          width={520}
          height={130}
          className="h-10 w-auto"
        />

        <nav aria-label="Footernavigatie">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
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

        <p className="text-sm opacity-60">
          &copy; {new Date().getFullYear()} Veramiek. Handgemaakt keramiek.
        </p>
      </div>
    </footer>
  );
}
