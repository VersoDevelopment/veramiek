import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { publishedPosts } from "@/lib/content";

const siteUrl = process.env.SITE_URL ?? "https://veramiek.nl";

/**
 * De sitemap haalt de producten live op, zodat een nieuw stuk uit Vera's admin
 * er vanzelf in staat zonder deploy. Preview-routes en de winkelwagen blijven
 * er bewust buiten.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/collecties`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/workshops`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/over-mij`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const posts: MetadataRoute.Sitemap = publishedPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.available !== false)
    .map((p) => ({
      url: `${siteUrl}/collecties/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...posts, ...productPages];
}
