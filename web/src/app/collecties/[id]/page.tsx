import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductSpecs } from "@/components/ui/ProductSpecs";
import {
  formatPrice,
  getContent,
  getProducts,
  normalizeCategory,
  type Product,
} from "@/lib/api";
import { jsonLdScript } from "@/lib/jsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  categoryPageForProduct,
  productDescription,
  productTitle,
  productVariant,
  siteUrl,
} from "@/lib/seo";

type Params = { params: Promise<{ id: string }> };

/**
 * Haalt het product plus de volledige lijst op. De lijst is nodig omdat een
 * titel pas uniek te maken is als je weet welke andere producten dezelfde naam
 * dragen (zie productVariant in lib/seo.ts).
 */
async function loadProduct(
  id: string,
): Promise<{ product: Product; all: Product[] } | null> {
  const all = await getProducts();
  const product = all.find((p) => p.id === id && p.available !== false);
  return product ? { product, all } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const found = await loadProduct(id);
  if (!found) return { title: "Product niet gevonden" };

  const { product, all } = found;
  const titel = productTitle(product, all);
  const omschrijving = productDescription(product, all);

  return {
    title: titel,
    description: omschrijving,
    alternates: { canonical: `/collecties/${product.id}` },
    openGraph: {
      type: "website",
      title: titel,
      description: omschrijving,
      url: `/collecties/${product.id}`,
      images: product.images[0]
        ? [{ url: product.images[0], alt: titel }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const [found, content] = await Promise.all([loadProduct(id), getContent()]);

  if (!found) notFound();

  const { product, all } = found;
  const categorie = normalizeCategory(product.category);
  const categoriePagina = categoryPageForProduct(product);
  const { label: variant } = productVariant(product, all);
  const titel = productTitle(product, all);

  /**
   * Product-markup zodat Google prijs en beschikbaarheid bij het zoekresultaat
   * kan tonen. Alleen gegevens die ook op de pagina zelf staan.
   *
   * Bewust NIET opgenomen: shippingDetails en hasMerchantReturnPolicy. Google
   * vraagt daarom, maar de verzendkosten worden per bestelling afgestemd
   * (zie /winkelwagen) en er staat geen retourtermijn op de site. Verzonnen
   * waarden daar zijn erger dan ontbrekende: die leveren een mismatch op
   * tussen markup en pagina.
   */
  const geldigTot = new Date();
  geldigTot.setFullYear(geldigTot.getFullYear() + 1);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: titel,
    description: product.desc || undefined,
    image: product.images.length
      ? product.images.map(absoluteUrl)
      : undefined,
    sku: product.id,
    category: categorie,
    material: content.material?.clay || undefined,
    size: product.size || undefined,
    brand: { "@type": "Brand", name: "Veramiek" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/collecties/${product.id}`,
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      priceValidUntil: geldigTot.toISOString().slice(0, 10),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.available === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Veramiek" },
    },
  };

  /** Kruimelpad: home → collecties → (categoriepagina) → dit product. */
  const crumbs = [
    { naam: "Home", pad: "/" },
    { naam: "Collecties", pad: "/collecties" },
    ...(categoriePagina
      ? [{ naam: categoriePagina.titel, pad: `/keramiek/${categoriePagina.slug}` }]
      : []),
    { naam: titel, pad: `/collecties/${product.id}` },
  ];

  return (
    <article className="px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Kruimelpad" className="mb-10 text-base tracking-[0.03em] opacity-70">
          <Link href="/collecties" className="transition-opacity hover:opacity-100">
            Collecties
          </Link>
          {categoriePagina && (
            <>
              <span aria-hidden className="mx-2 text-sage">
                /
              </span>
              <Link
                href={`/keramiek/${categoriePagina.slug}`}
                className="transition-opacity hover:opacity-100"
              >
                {categoriePagina.categorie}
              </Link>
            </>
          )}
          <span aria-hidden className="mx-2 text-sage">
            /
          </span>
          <span>{product.name}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <ProductGallery images={product.images} alt={titel} />

          <div className="md:pt-6">
            <p className="text-base tracking-[0.22em] text-white/55 uppercase">
              {/* Bij varianten hoort de collectie hier zichtbaar bij, anders zijn
                  drie Chip & Dip Bowls op de pagina zelf niet uit elkaar te
                  houden en is alleen de title-tag uniek. */}
              {variant ? `${categorie} · ${variant}` : categorie}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl">{product.name}</h1>
            <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

            <p className="mt-8 font-display text-3xl tracking-[0.04em]">
              {formatPrice(product.price)}
            </p>

            {product.desc && (
              <p className="mt-8 max-w-[46ch] text-lg text-white/90">
                {product.desc}
              </p>
            )}

            {product.story && (
              <p className="mt-6 max-w-[46ch] text-lg text-white/90">
                {product.story}
              </p>
            )}

            <div className="mt-12">
              <AddToCartButton product={product} />
            </div>

            <ProductSpecs product={product} material={content.material} />

            <p className="mt-10 max-w-[46ch] text-base opacity-70">
              Elk stuk is met de hand gemaakt, kleine verschillen in vorm, kleur
              en glazuur zijn daar het bewijs van. Vragen over dit stuk of een
              maatwerkwens? Neem gerust{" "}
              <Link
                href="/contact"
                className="underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              >
                contact
              </Link>{" "}
              op.
            </p>

            {categoriePagina && (
              <p className="mt-6 max-w-[46ch] text-base opacity-70">
                Meer uit deze categorie:{" "}
                <Link
                  href={`/keramiek/${categoriePagina.slug}`}
                  className="underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {categoriePagina.titel.toLowerCase()}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
