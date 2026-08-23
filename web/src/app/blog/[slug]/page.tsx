import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealSection } from "@/components/ui/RevealSection";
import { getBlogs, metArtikel } from "@/lib/api";
import { jsonLdScript } from "@/lib/jsonLd";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/*
 * Geen generateStaticParams meer: de artikelen komen nu uit de API en een
 * nieuw stuk moet meteen bereikbaar zijn, zonder de site opnieuw te bouwen.
 */
async function vindArtikel(slug: string) {
  const posts = metArtikel(await getBlogs());
  return posts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await vindArtikel(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: [{ url: post.image, alt: post.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await vindArtikel(slug);
  if (!post) notFound();

  /**
   * Article-markup. Ontbrak volledig: de artikelen waren voor Google gewoon
   * pagina's, zonder auteur, uitgever of onderwerp.
   *
   * `datePublished` staat er alleen bij als het in het beheerscherm is
   * ingevuld.
   * Google toont graag een datum, maar een verzonnen datum is erger dan geen
   * datum: die belandt in het zoekresultaat en klopt dan niet.
   */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    inLanguage: "nl-NL",
    author: { "@type": "Person", name: "Vera" },
    publisher: { "@id": `${siteUrl}/#veramiek` },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    ...(post.datePublished ? { datePublished: post.datePublished } : {}),
  };

  const crumbs = [
    { naam: "Home", pad: "/" },
    { naam: "Blogs", pad: "/blog" },
    { naam: post.title, pad: `/blog/${post.slug}` },
  ];

  return (
    <RevealSection className="px-6 pt-44 pb-28 md:pb-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
      <article className="mx-auto max-w-[65ch]">
        <p className="text-base tracking-[0.22em] text-white/55 uppercase">
          {post.meta}
        </p>
        <h1 className="mt-4 text-4xl text-balance md:text-5xl">{post.title}</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            sizes="(min-width: 768px) 65ch, 100vw"
            className="object-cover"
            style={{ objectPosition: post.objectPosition ?? "center" }}
            priority
          />
        </div>

        <div className="mt-12 space-y-7 text-lg text-white/90">
          {post.body?.slice(0, 2).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        {/* Twee staande foto's naast elkaar, halverwege het artikel. */}
        {post.gallery?.length ? (
          <div className="mt-12 grid grid-cols-2 gap-5">
            {post.gallery.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 32ch, 50vw"
                  className="object-cover"
                  style={{ objectPosition: photo.objectPosition ?? "center" }}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-12 space-y-7 text-lg text-white/90">
          {post.body?.slice(2).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14">
          <CtaButton href="/blog" variant="lightOutline">
            Alle blogs
          </CtaButton>
        </div>
      </article>
    </RevealSection>
  );
}
