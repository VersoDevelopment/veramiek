import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { publishedPosts } from "@/lib/content";
import { CATEGORY_PAGES, siteUrl } from "@/lib/seo";

/**
 * De sitemap haalt de producten live op, zodat een nieuw stuk uit Vera's admin
 * er vanzelf in staat zonder deploy. Preview-routes en de winkelwagen blijven
 * er bewust buiten.
 *
 * Geen `lastModified` meer. Dat stond op `new Date()`, dus elke URL kreeg bij
 * iedere aanvraag de huidige tijd mee en beweerde net gewijzigd te zijn. Google
 * vergelijkt dat met wat er werkelijk verandert, ziet de tegenspraak en negeert
 * daarna de lastmod van de hele site. Een ontbrekende datum is een eerlijk
 * "onbekend" en is beter dan een datum die altijd liegt. Zodra de API of de
 * blogposts een echte wijzigingsdatum bijhouden, kan hij hier per URL terug.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/collecties`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/workshops`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/over-mij`, changeFrequency: "yearly", priority: 0.7 },
    {
      url: `${siteUrl}/keramiek-etten-leur`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${siteUrl}/blog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  /** De categoriepagina's; belangrijker dan losse producten, minder dan /collecties. */
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_PAGES.map((c) => ({
    url: `${siteUrl}/keramiek/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = publishedPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.available !== false)
    .map((p) => ({
      url: `${siteUrl}/collecties/${p.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...posts, ...productPages];
}
