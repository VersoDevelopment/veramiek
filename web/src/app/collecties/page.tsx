import type { Metadata } from "next";
import Link from "next/link";
import { ShopFilter } from "@/components/sections/ShopFilter";
import { getProducts } from "@/lib/api";
import { CATEGORY_PAGES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Collecties",
  description:
    "Handgemaakt keramiek uit het atelier van Vera. Elk stuk is uniek, met de hand gevormd en met aandacht afgewerkt.",
  alternates: { canonical: "/collecties" },
};

export default async function CollectiesPage({
  searchParams,
}: {
  searchParams: Promise<{ soort?: string; collectie?: string }>;
}) {
  const [{ soort, collectie }, products] = await Promise.all([
    searchParams,
    getProducts(),
  ]);

  return (
    <section className="relative px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backgrounds/takken-wijnrood.webp)" }}
      />
      <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <h1 className="text-4xl md:text-5xl">Collecties</h1>
        <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-sage/70" />
        <p className="mx-auto mt-8 max-w-[52ch] text-base opacity-85">
          Elk stuk is met de hand gedraaid en uniek. Kleine verschillen in vorm
          en glazuur horen erbij, dat maakt het handwerk.
        </p>

        {/* Ingang naar de categoriepagina's. Het filter hieronder werkt met een
            querystring en levert dus geen aparte pagina op; deze links doen dat
            wel, en zijn meteen de enige interne verwijzing ernaartoe. */}
        <nav aria-label="Categorieën" className="mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {CATEGORY_PAGES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/keramiek/${c.slug}`}
                  className="text-base tracking-[0.03em] underline decoration-sage/60 decoration-1 underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
                >
                  {c.categorie}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {products.length === 0 ? (
        <p className="py-16 text-center text-base opacity-70">
          De collectie wordt op dit moment bijgewerkt. Kom snel weer terug.
        </p>
      ) : (
        <div className="mx-auto max-w-6xl">
          <ShopFilter
            products={products}
            initialCategory={soort}
            initialCollection={collectie}
          />
        </div>
      )}
    </section>
  );
}
