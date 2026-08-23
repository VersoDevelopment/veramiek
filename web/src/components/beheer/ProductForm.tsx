"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Field, TextAreaField } from "@/components/ui/Field";
import { SHOP_CATEGORIES, type Product } from "@/lib/api";
import { BeheerFout, bewerkProduct, maakProduct, uploadFoto } from "@/lib/beheer";

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
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="space-y-8">
        <Field
          id="p-naam"
          name="naam"
          label="Naam"
          required
          value={waarden.name}
          onChange={(v) => zet("name", v)}
        />
        <div className="grid gap-8 sm:grid-cols-2">
          <Field
            id="p-prijs"
            name="prijs"
            label="Prijs in euro"
            value={waarden.price}
            onChange={(v) => zet("price", v)}
            inputMode="numeric"
            placeholder="14,95"
          />
          <Field
            id="p-voorraad"
            name="voorraad"
            label="Voorraad"
            value={waarden.stock}
            onChange={(v) => zet("stock", v)}
            inputMode="numeric"
            placeholder="leeg = niet geteld"
          />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label
              htmlFor="p-categorie"
              className="text-sm tracking-[0.14em] text-wine/70 uppercase"
            >
              Categorie
            </label>
            <select
              id="p-categorie"
              value={waarden.category}
              onChange={(e) => zet("category", e.target.value)}
              className="mt-2 w-full border-b border-wine/25 bg-transparent pb-2 text-base text-wine focus:border-wine focus:outline-none"
            >
              {SHOP_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Field
            id="p-collectie"
            name="collectie"
            label="Collectie"
            value={waarden.collection}
            onChange={(v) => zet("collection", v)}
            placeholder="Zeeuws Zand"
          />
        </div>
      </section>

      <section className="space-y-8 border-t border-wine/10 pt-10">
        <h3 className="text-sm tracking-[0.14em] text-wine/50 uppercase">
          Op de productpagina
        </h3>
        <TextAreaField
          id="p-desc"
          name="desc"
          label="Korte omschrijving"
          rows={2}
          value={waarden.desc}
          onChange={(v) => zet("desc", v)}
          placeholder="Een of twee zinnen, dit staat ook in Google."
        />
        <TextAreaField
          id="p-story"
          name="story"
          label="Het verhaal bij dit stuk"
          rows={6}
          value={waarden.story}
          onChange={(v) => zet("story", v)}
          placeholder="Waarom is dit stuk bijzonder, hoe is het gemaakt, waar past het bij."
        />
        <div className="grid gap-8 sm:grid-cols-2">
          <Field
            id="p-maat"
            name="maat"
            label="Afmeting"
            value={waarden.size}
            onChange={(v) => zet("size", v)}
            placeholder="9 x 8 cm"
          />
          <Field
            id="p-inhoud"
            name="inhoud"
            label="Inhoud"
            value={waarden.volume}
            onChange={(v) => zet("volume", v)}
            placeholder="300 ml"
          />
        </div>
        <Field
          id="p-waarvoor"
          name="waarvoor"
          label="Waar is het voor"
          value={waarden.purpose}
          onChange={(v) => zet("purpose", v)}
          placeholder="Voor je ochtendkoffie."
        />
        <Field
          id="p-badge"
          name="badge"
          label="Labeltje"
          value={waarden.badge}
          onChange={(v) => zet("badge", v)}
          placeholder="Nieuw"
        />
      </section>

      <section className="space-y-5 border-t border-wine/10 pt-10">
        <h3 className="text-sm tracking-[0.14em] text-wine/50 uppercase">
          Foto&apos;s
        </h3>
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
                  className="h-24 w-24 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => verwijderFoto(url)}
                  className="absolute -top-2 -right-2 h-7 w-7 cursor-pointer rounded-full bg-wine text-sm text-white"
                  aria-label="Deze foto weghalen"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={bestandKiezer}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          className="block text-base text-wine/70 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-wine/10 file:px-5 file:py-2 file:text-base file:text-wine"
        />
        {uploadBezig && (
          <p className="text-base text-wine/70">Bezig met uploaden...</p>
        )}
      </section>

      <section className="border-t border-wine/10 pt-10">
        <label className="flex cursor-pointer items-center gap-3 text-base text-wine">
          <input
            type="checkbox"
            checked={waarden.available}
            onChange={(e) => zet("available", e.target.checked)}
            className="h-5 w-5 accent-wine"
          />
          Zichtbaar in de webshop
        </label>
      </section>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {fout && <p className="text-base text-wine">{fout}</p>}
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={bezig}
          className="inline-flex cursor-pointer items-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {bezig ? "Opslaan..." : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={onAnnuleer}
          className="cursor-pointer text-base text-wine/70 underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-100"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
