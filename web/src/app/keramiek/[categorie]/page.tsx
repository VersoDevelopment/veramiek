import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/ui/ProductTile";
import { getProducts, normalizeCategory } from "@/lib/api";
import { jsonLdScript } from "@/lib/jsonLd";
import {
  breadcrumbJsonLd,
  CATEGORY_PAGES,
  findCategoryPage,
  productTitle,
  siteUrl,
} from "@/lib/seo";

/**
 * Categoriepagina's onder /keramiek/<soort>.
 *
 * Waarom een eigen route en niet /collecties?soort=Mokken: dat filter is een
 * querystring die client-side wordt gezet, dus er is geen aparte pagina om te
 * indexeren en geen plek voor een eigen H1, tekst en canonical. Long-tail als
 * "handgemaakte mokken" had daardoor nergens om op te landen.
 *
 * Bewust onder /keramiek/ en niet onder /collecties/: die route heeft al een
 * [id]-segment voor producten, en een statisch segment ernaast zou de URL's
 * door elkaar laten lopen.
 */

type Params = { params: Promise<{ categorie: string }> };

/** Zelfde galerie-ritme als de winkel: twee grote, drie kleinere tegels. */
const SPAN_RHYTHM = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];
const ASPECT_RHYTHM = [
  "aspect-[5/6]",
  "aspect-[5/6]",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-[3/4]",
];

/**
 * Bewust geen generateStaticParams: getProducts draait op `cache: "no-store"`
 * zodat Vera's admin-wijzigingen meteen zichtbaar zijn, waardoor deze route net
 * als /collecties/[id] per aanvraag rendert. Vooraf genereren zou de pagina's
 * bij de build tegen een onbereikbare API aan laten lopen en leeg vastleggen.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorie } = await params;
  const pagina = findCategoryPage(categorie);
  if (!pagina) return { title: "Pagina niet gevonden" };

  return {
    title: pagina.metaTitel,
    description: pagina.omschrijving,
    alternates: { canonical: `/keramiek/${pagina.slug}` },
    openGraph: {
      type: "website",
      title: pagina.metaTitel,
      description: pagina.omschrijving,
      url: `/keramiek/${pagina.slug}`,
    },
  };
}

export default async function CategoriePagina({ params }: Params) {
  const { categorie } = await params;
  const pagina = findCategoryPage(categorie);

  if (!pagina) notFound();

  const alle = await getProducts();
  const producten = alle.filter(
    (p) => normalizeCategory(p.category) === pagina.categorie,
  );

  const crumbs = [
    { naam: "Home", pad: "/" },
    { naam: "Collecties", pad: "/collecties" },
    { naam: pagina.titel, pad: `/keramiek/${pagina.slug}` },
  ];

  /** ItemList maakt expliciet welke producten op deze pagina staan. */
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pagina.titel,
    itemListElement: producten.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: productTitle(p, alle),
      url: `${siteUrl}/collecties/${p.id}`,
    })),
  };

  const andereCategorieen = CATEGORY_PAGES.filter((c) => c.slug !== pagina.slug);

  return (
    <section className="relative px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backgrounds/takken-wijnrood.webp)" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
      {producten.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }}
        />
      )}

      <nav
        aria-label="Kruimelpad"
        className="mx-auto mb-10 max-w-6xl text-base tracking-[0.03em] opacity-70"
      >
        <Link href="/collecties" className="transition-opacity hover:opacity-100">
          Collecties
        </Link>
        <span aria-hidden className="mx-2 text-sage">
          /
        </span>
        <span>{pagina.categorie}</span>
      </nav>

      <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <h1 className="text-4xl md:text-5xl">{pagina.titel}</h1>
        <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-sage/70" />
        <p className="mx-auto mt-8 max-w-[56ch] text-base opacity-85">
          {pagina.intro}
        </p>
      </header>

      <div className="mx-auto max-w-6xl">
        {producten.length === 0 ? (
          <p className="py-16 text-center text-base opacity-70">
            Er staat op dit moment niets in deze categorie. Bekijk{" "}
            <Link
              href="/collecties"
              className="underline decoration-sage decoration-1 underline-offset-4"
            >
              alle collecties
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-14">
            {producten.map((product, i) => (
              <div key={product.id} className={SPAN_RHYTHM[i % SPAN_RHYTHM.length]}>
                <ProductTile
                  product={product}
                  aspectClass={ASPECT_RHYTHM[i % ASPECT_RHYTHM.length]}
                  label={productTitle(product, alle)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Onderlinge links tussen de categorieën: zonder deze zijn het zes
          losse eindpunten die alleen vanuit het menu bereikbaar zijn. */}
      <nav
        aria-label="Andere categorieën"
        className="mx-auto mt-24 max-w-6xl border-t border-sage/30 pt-10"
      >
        <h2 className="text-2xl">Ander keramiek</h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {andereCategorieen.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/keramiek/${c.slug}`}
                className="text-base tracking-[0.03em] underline decoration-sage/60 decoration-1 underline-offset-4 opacity-85 transition-opacity hover:opacity-100"
              >
                {c.titel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
