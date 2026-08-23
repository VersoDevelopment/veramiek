import type { Metadata } from "next";
import { BeheerApp } from "@/components/beheer/BeheerApp";

/**
 * Het beheerscherm. Vervangt admin.html uit het tijdperk van de statische
 * site. De Express-API blijft eronder liggen: login, opslag en uploads zijn
 * ongewijzigd, alleen de bediening is opnieuw gebouwd.
 *
 * noindex hoort hier hard: een beheerpagina in Google is niet gevaarlijk maar
 * wel slordig, en hij staat ook in robots.ts.
 */
export const metadata: Metadata = {
  title: "Beheer",
  robots: { index: false, follow: false },
};

export default function BeheerPage() {
  return (
    <div className="min-h-dvh bg-ivory text-wine">
      <BeheerApp />
    </div>
  );
}
