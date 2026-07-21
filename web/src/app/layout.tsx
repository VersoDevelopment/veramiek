import type { Metadata } from "next";
import { Gruppo, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const gruppo = Gruppo({
  variable: "--font-gruppo",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Basis-URL voor alle absolute URL's in metadata (canonical, og:image).
 * Op staging staat SITE_URL op het stagingdomein, zodat de
 * canonicals daar niet stiekem naar de live site wijzen.
 */
const siteUrl = process.env.SITE_URL ?? "https://veramiek.nl";

/** Staging en previews mogen niet in Google terechtkomen. */
const indexable = process.env.SITE_NOINDEX !== "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Veramiek | Handgemaakt keramiek uit Etten-Leur",
    template: "%s | Veramiek",
  },
  description:
    "Handgemaakt keramiek uit het atelier van Vera in Etten-Leur. Unieke stukken, workshops aan de draaischijf en verhalen uit het atelier.",
  applicationName: "Veramiek",
  authors: [{ name: "Veramiek" }],
  keywords: [
    "handgemaakt keramiek",
    "keramiek Etten-Leur",
    "keramiek workshop",
    "pottenbakken workshop Brabant",
    "handgedraaide mokken",
    "Veramiek",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "Veramiek",
    title: "Veramiek | Handgemaakt keramiek uit Etten-Leur",
    description:
      "Handgemaakt keramiek uit het atelier van Vera. Unieke stukken, workshops en verhalen van achter de draaischijf.",
    images: [
      {
        url: "/images/studio-hero.webp",
        width: 1200,
        height: 630,
        alt: "Keramiek uit het atelier van Veramiek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veramiek | Handgemaakt keramiek uit Etten-Leur",
    description:
      "Handgemaakt keramiek uit het atelier van Vera. Unieke stukken, workshops en verhalen van achter de draaischijf.",
    images: ["/images/studio-hero.webp"],
  },
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/**
 * LocalBusiness-markup zodat Google het atelier als lokale onderneming kan
 * tonen. Alleen feitelijke gegevens die ook op de site staan.
 */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#veramiek`,
  name: "Veramiek",
  description:
    "Atelier voor handgemaakt keramiek in Etten-Leur. Unieke handgedraaide stukken en workshops aan de draaischijf.",
  url: siteUrl,
  image: `${siteUrl}/images/studio-hero.webp`,
  logo: `${siteUrl}/logo/logo-horizontal.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Etten-Leur",
    addressRegion: "Noord-Brabant",
    addressCountry: "NL",
  },
  sameAs: [
    "https://www.instagram.com/veramiek",
    "https://www.tiktok.com/@veramiek",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${playfair.variable} ${gruppo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-base focus:tracking-[0.03em] focus:text-wine focus-visible:outline-wine"
        >
          Direct naar inhoud
        </a>
        <CartProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
