"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Verbergt de sitechrome (navigatie, footer, winkelwagenlade) op het
 * beheerscherm. Dat scherm is geen pagina van de website en moet niet onder
 * een transparante hero-navigatie schuiven.
 *
 * Dit is bewust een kleine client-schil in plaats van een route-groep met een
 * eigen layout: dat laatste zou betekenen dat elke bestaande pagina verplaatst
 * moet worden, en dat is een grote verbouwing voor een klein doel.
 */
export function AlleenPubliek({ children }: { children: ReactNode }) {
  const pad = usePathname();
  if (pad?.startsWith("/beheer")) return null;
  return <>{children}</>;
}
