import type { Metadata } from "next";
import { ShopFilter } from "@/components/sections/ShopFilter";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Collecties | Veramiek",
  description:
    "Handgemaakt keramiek uit het atelier van Vera. Elk stuk is uniek, met de hand gevormd en met aandacht afgewerkt.",
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
    <section className="bg-white px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <h1 className="text-4xl md:text-5xl">Collecties</h1>
        <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-sage/70" />
        <p className="mx-auto mt-8 max-w-[52ch] text-base opacity-85">
          Elk stuk is met de hand gedraaid en uniek. Kleine verschillen in vorm
          en glazuur horen erbij, dat maakt het handwerk.
        </p>
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
