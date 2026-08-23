import type { Product, SiteContent } from "@/lib/api";

type Props = {
  product: Product;
  material?: SiteContent["material"];
};

/**
 * De harde gegevens onder de productomschrijving. Twee bronnen lopen hier
 * samen: wat per stuk verschilt (afmeting, inhoud, waarvoor) staat op het
 * product zelf, wat voor het hele assortiment geldt (klei, glazuur,
 * vaatwasser) komt uit de site-content. Vera vult dat laatste dus een keer in
 * en niet bij vijfentwintig producten.
 *
 * Lege waarden vallen weg in plaats van dat er "onbekend" komt te staan: een
 * gat is eerlijker dan een invulling, en de rij verschijnt vanzelf zodra ze
 * het invult.
 */
export function ProductSpecs({ product, material }: Props) {
  const regels: Array<[string, string | undefined]> = [
    ["Afmeting", product.size],
    ["Inhoud", product.volume],
    ["Waarvoor", product.purpose],
    ["Klei", material?.clay],
    ["Glazuur", material?.glaze],
    ["Vaatwasser", material?.dishwasher],
    ["Magnetron", material?.microwave],
    ["Oven", material?.oven],
  ];

  const gevuld = regels.filter(([, waarde]) => (waarde ?? "").trim() !== "");
  const onderhoud = (material?.maintenance ?? "").trim();

  if (gevuld.length === 0 && onderhoud === "") return null;

  return (
    <section className="mt-12 max-w-[46ch]">
      <h2 className="text-base tracking-[0.22em] text-white/55 uppercase">
        Over dit stuk
      </h2>

      {gevuld.length > 0 && (
        <dl className="mt-6 text-base">
          {gevuld.map(([label, waarde]) => (
            <div
              key={label}
              className="flex gap-4 border-t border-white/10 py-3 first:border-t-0 first:pt-0"
            >
              <dt className="w-32 shrink-0 opacity-70">{label}</dt>
              <dd className="text-white/90">{waarde}</dd>
            </div>
          ))}
        </dl>
      )}

      {onderhoud !== "" && (
        <p className="mt-6 text-base opacity-70">{onderhoud}</p>
      )}
    </section>
  );
}
