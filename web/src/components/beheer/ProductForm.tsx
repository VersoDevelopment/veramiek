"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SHOP_CATEGORIES, type Product } from "@/lib/api";
import { BeheerFout, bewerkProduct, maakProduct, uploadFoto } from "@/lib/beheer";
import { Blok, FotoKiezer, Keuze, Knop, Tekstvlak, Veld } from "./Veld";

type Props = {
  product: Product | null;
  onKlaar: (bewaard: Product) => void;
  onAnnuleer: () => void;
};

/** Alles als string in de state; pas bij opslaan gaat het naar het juiste type. */
type Formulier = {
  name: string;
  desc: string;
  story: string;
  price: string;
  category: string;
  collection: string;
  badge: string;
  size: string;
  volume: string;
  glaze: string;
  purpose: string;
  stock: string;
  available: boolean;
  images: string[];
};

function naarFormulier(product: Product | null): Formulier {
  return {
    name: product?.name ?? "",
    desc: product?.desc ?? "",
    story: product?.story ?? "",
    price: product ? String(product.price) : "",
    category: product?.category ?? "Overige",
    collection: product?.collection ?? "",
    badge: product?.badge ?? "",
    size: product?.size ?? "",
    volume: product?.volume ?? "",
    glaze: product?.glaze ?? "",
    purpose: product?.purpose ?? "",
    /* Niets ingevuld blijft leeg: "niet geteld" is geen "nul". */
    stock: product?.stock == null ? "" : String(product.stock),
    available: product?.available !== false,
    images: product?.images ?? [],
  };
}

export function ProductForm({ product, onKlaar, onAnnuleer }: Props) {
  const [waarden, setWaarden] = useState<Formulier>(() => naarFormulier(product));
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [uploadBezig, setUploadBezig] = useState(false);
  const bestandKiezer = useRef<HTMLInputElement>(null);

  function zet<K extends keyof Formulier>(sleutel: K, waarde: Formulier[K]) {
    setWaarden((vorige) => ({ ...vorige, [sleutel]: waarde }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const bestand = e.target.files?.[0];
    if (!bestand) return;
    setUploadBezig(true);
    setFout("");
    try {
      const url = await uploadFoto(bestand);
      setWaarden((vorige) => ({ ...vorige, images: [...vorige.images, url] }));
    } catch (error) {
      setFout(error instanceof BeheerFout ? error.message : "Uploaden mislukt.");
    } finally {
      setUploadBezig(false);
      /* Zonder dit kan dezelfde foto niet nog eens gekozen worden. */
      if (bestandKiezer.current) bestandKiezer.current.value = "";
    }
  }

  function verwijderFoto(url: string) {
    setWaarden((vorige) => ({
      ...vorige,
      images: vorige.images.filter((u) => u !== url),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!waarden.name.trim()) {
      setFout("Een naam is verplicht.");
      return;
    }
    setBezig(true);
    setFout("");

    const nieuw: Partial<Product> = {
      name: waarden.name.trim(),
      desc: waarden.desc.trim(),
      story: waarden.story.trim(),
      price: Number(waarden.price.replace(",", ".")) || 0,
      category: waarden.category,
      collection: waarden.collection.trim(),
      badge: waarden.badge.trim() || null,
      size: waarden.size.trim(),
      volume: waarden.volume.trim(),
      glaze: waarden.glaze.trim(),
      purpose: waarden.purpose.trim(),
      stock: waarden.stock.trim() === "" ? null : Number(waarden.stock),
      available: waarden.available,
      images: waarden.images,
    };

    try {
      const bewaard = product
        ? await bewerkProduct(product.id, nieuw)
        : await maakProduct(nieuw);
      onKlaar(bewaard);
    } catch (error) {
      setFout(error instanceof BeheerFout ? error.message : "Opslaan mislukt.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28">
      <Blok titel="Het product">
        <Veld
          id="p-naam"
          label="Naam"
          verplicht
          waarde={waarden.name}
          onChange={(v) => zet("name", v)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id="p-prijs"
            label="Prijs in euro"
            waarde={waarden.price}
            onChange={(v) => zet("price", v)}
            inputMode="numeric"
            placeholder="14,95"
          />
          <Veld
            id="p-voorraad"
            label="Voorraad"
            waarde={waarden.stock}
            onChange={(v) => zet("stock", v)}
            inputMode="numeric"
            placeholder="3"
            uitleg="Leeg laten betekent: niet geteld."
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Keuze
            id="p-categorie"
            label="Categorie"
            waarde={waarden.category}
            onChange={(v) => zet("category", v)}
            opties={SHOP_CATEGORIES}
          />
          <Veld
            id="p-collectie"
            label="Collectie"
            waarde={waarden.collection}
            onChange={(v) => zet("collection", v)}
            placeholder="Zeeuws Zand"
          />
        </div>
      </Blok>

      <Blok
        titel="Teksten"
        uitleg="Dit staat op de productpagina en in Google."
      >
        <Tekstvlak
          id="p-desc"
          label="Korte omschrijving"
          regels={2}
          waarde={waarden.desc}
          onChange={(v) => zet("desc", v)}
          placeholder="Een of twee zinnen."
        />
        <Tekstvlak
          id="p-story"
          label="Het verhaal bij dit stuk"
          regels={7}
          waarde={waarden.story}
          onChange={(v) => zet("story", v)}
          placeholder="Waarom is dit stuk bijzonder, hoe is het gemaakt, waar past het bij."
          uitleg="Hoe uitgebreider, hoe beter de pagina in Google komt. Mik op honderd woorden."
        />
      </Blok>

      <Blok
        titel="Gegevens van het stuk"
        uitleg="Wat leeg blijft, verschijnt niet op de pagina."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id="p-maat"
            label="Afmeting"
            waarde={waarden.size}
            onChange={(v) => zet("size", v)}
            placeholder="9 x 8 cm"
          />
          <Veld
            id="p-inhoud"
            label="Inhoud"
            waarde={waarden.volume}
            onChange={(v) => zet("volume", v)}
            placeholder="300 ml"
          />
        </div>
        <Veld
          id="p-glazuur"
          label="Glazuur"
          waarde={waarden.glaze}
          onChange={(v) => zet("glaze", v)}
          placeholder="zandbeige, mat"
        />
        <Veld
          id="p-waarvoor"
          label="Waar is het voor"
          waarde={waarden.purpose}
          onChange={(v) => zet("purpose", v)}
          placeholder="Voor je ochtendkoffie."
        />
        <Veld
          id="p-badge"
          label="Labeltje"
          waarde={waarden.badge}
          onChange={(v) => zet("badge", v)}
          placeholder="Nieuw"
          uitleg="Klein tekstje op de foto in de webshop."
        />
      </Blok>

      <Blok titel="Foto's">
        {waarden.images.length > 0 && (
          <ul className="flex flex-wrap gap-3">
            {waarden.images.map((url) => (
              <li key={url} className="relative">
                <Image
                  src={url}
                  alt=""
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => verwijderFoto(url)}
                  className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-wine text-[0.8rem] leading-none text-white"
                  aria-label="Deze foto weghalen"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
        <FotoKiezer
          id="p-foto"
          label="Foto toevoegen"
          bezig={uploadBezig}
          onKies={handleUpload}
          invoerRef={bestandKiezer}
        />
      </Blok>

      <Blok titel="Zichtbaarheid">
        <label className="flex cursor-pointer items-center gap-3 text-[0.95rem] text-wine">
          <input
            type="checkbox"
            checked={waarden.available}
            onChange={(e) => zet("available", e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Zichtbaar in de webshop
        </label>
      </Blok>

      {/* Opslaan staat vast onderin: het formulier is lang en anders moet ze
          na elke wijziging helemaal naar beneden scrollen. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-wine/12 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
          <Knop type="submit" soort="vol" disabled={bezig}>
            {bezig ? "Opslaan..." : "Opslaan"}
          </Knop>
          <Knop type="button" onClick={onAnnuleer}>
            Annuleren
          </Knop>
          <div aria-live="polite" className="flex-1 text-right">
            {fout && <span className="text-[0.9rem] text-wine">{fout}</span>}
          </div>
        </div>
      </div>
    </form>
  );
}
