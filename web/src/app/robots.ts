import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://veramiek.nl";
const indexable = process.env.SITE_NOINDEX !== "true";

/**
 * Op staging (SITE_NOINDEX=true) wordt alles geweigerd, zodat de
 * proefversie nooit naast de echte site in de zoekresultaten opduikt.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Winkelwagen heeft geen zoekwaarde; de preview-routes zijn werkpagina's.
        disallow: ["/winkelwagen", "/preview-"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
