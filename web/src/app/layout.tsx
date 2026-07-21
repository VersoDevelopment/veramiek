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
 * Basis-URL voor alle absolute URL's in metadata (canonical, og:image). Staat
 * ook op de proefversie al op het definitieve domein, zodat de cutover geen
 * herbouw vraagt; de proefversie wordt afgeschermd met een wachtwoord en een
 * X-Robots-Tag in nginx-app.conf.
 */
const siteUrl = process.env.SITE_URL ?? "https://veramiek.nl";

/** Noodrem om de hele site uit Google te houden. Wordt bij de build vastgelegd. */
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
  // Bewust GEEN alternates.canonical hier: metadata erft door, dus een
  // canonical in de layout zou elke pagina naar de homepage laten wijzen.
  // Elke pagina zet zijn eigen canonical.
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
        url: "/images/og-veramiek.jpg",
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
    images: ["/images/og-veramiek.jpg"],
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
  image: `${siteUrl}/images/og-veramiek.jpg`,
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
