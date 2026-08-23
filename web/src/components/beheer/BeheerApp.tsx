"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/api";
import {
  BeheerFout,
  haalProducten,
  leesToken,
  verwijderProduct,
  wisToken,
} from "@/lib/beheer";
import { LoginForm } from "./LoginForm";
import { MateriaalForm } from "./MateriaalForm";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";

type Tab = "producten" | "materiaal";

/* Bewerkt een bestaand product, of null voor een nieuw stuk. Undefined
   betekent: het formulier staat niet open. */
type Bewerking = Product | null | undefined;

export function BeheerApp() {
  const [ingelogd, setIngelogd] = useState(false);
  const [gecontroleerd, setGecontroleerd] = useState(false);
  const [tab, setTab] = useState<Tab>("producten");

  const [producten, setProducten] = useState<Product[]>([]);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState("");
  const [bewerking, setBewerking] = useState<Bewerking>(undefined);
  const [teVerwijderen, setTeVerwijderen] = useState<Product | null>(null);
  const [bezigId, setBezigId] = useState<string | null>(null);

  /* Een token in de opslag zegt alleen dat er ooit is ingelogd, niet dat het
     nog geldig is. De eerste productaanvraag bewijst dat; een 401 daar gooit
     het token weg en zet ons terug op het inlogscherm. */
  useEffect(() => {
    setIngelogd(leesToken() !== null);
    setGecontroleerd(true);
  }, []);

  const laadProducten = useCallback(async () => {
    setLaden(true);
    setFout("");
    try {
      setProducten(await haalProducten());
    } catch (error) {
      if (error instanceof BeheerFout && error.status === 401) {
        setIngelogd(false);
        return;
      }
      setFout(
        error instanceof BeheerFout
          ? error.message
          : "De producten konden niet geladen worden.",
      );
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => {
    if (ingelogd) laadProducten();
  }, [ingelogd, laadProducten]);

  function uitloggen() {
    wisToken();
    setIngelogd(false);
    setProducten([]);
    setBewerking(undefined);
  }

  async function bevestigVerwijderen(product: Product) {
    setBezigId(product.id);
    setFout("");
    try {
      await verwijderProduct(product.id);
      setProducten((vorige) => vorige.filter((p) => p.id !== product.id));
      setTeVerwijderen(null);
    } catch (error) {
      setFout(
        error instanceof BeheerFout ? error.message : "Verwijderen mislukt.",
      );
    } finally {
      setBezigId(null);
    }
  }

  function naOpslaan(bewaard: Product) {
    setProducten((vorige) => {
      const bestaat = vorige.some((p) => p.id === bewaard.id);
      return bestaat
        ? vorige.map((p) => (p.id === bewaard.id ? bewaard : p))
        : [...vorige, bewaard];
    });
    setBewerking(undefined);
  }

  /* Niets tonen tot we weten of er een token is: anders flitst het
     inlogscherm bij iedereen die al ingelogd was. */
  if (!gecontroleerd) return null;

  if (!ingelogd) {
    return <LoginForm onIngelogd={() => setIngelogd(true)} />;
  }

  if (bewerking !== undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl text-wine">
          {bewerking ? bewerking.name : "Nieuw product"}
        </h1>
        <div className="mt-10">
          <ProductForm
            product={bewerking}
            onKlaar={naOpslaan}
            onAnnuleer={() => setBewerking(undefined)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl text-wine">Beheer</h1>
        <button
          type="button"
          onClick={uitloggen}
          className="cursor-pointer text-base text-wine/60 underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-100"
        >
          Uitloggen
        </button>
      </div>

      <nav className="mt-10 flex gap-6 border-b border-wine/15">
        {(
          [
            ["producten", "Producten"],
            ["materiaal", "Geldt voor alles"],
          ] as const
        ).map(([sleutel, label]) => (
          <button
            key={sleutel}
            type="button"
            onClick={() => setTab(sleutel)}
            className={`-mb-px cursor-pointer border-b-2 pb-3 text-base transition-colors ${
              tab === sleutel
                ? "border-wine text-wine"
                : "border-transparent text-wine/50 hover:text-wine"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div aria-live="polite" className="min-h-[1.5rem] pt-4">
        {fout && <p className="text-base text-wine">{fout}</p>}
      </div>

      {tab === "producten" ? (
        <>
          <div className="flex items-center justify-between py-4">
            <p className="text-base text-wine/60">
              {laden ? "Bezig met laden..." : `${producten.length} producten`}
            </p>
            <button
              type="button"
              onClick={() => setBewerking(null)}
              className="inline-flex cursor-pointer items-center rounded-full bg-wine px-6 py-3 text-base tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85"
            >
              Nieuw product
            </button>
          </div>

          {teVerwijderen && (
            <div className="mb-4 flex flex-wrap items-center gap-4 border border-wine/20 p-4">
              <p className="flex-1 text-base text-wine">
                {teVerwijderen.name} definitief verwijderen?
              </p>
              <button
                type="button"
                onClick={() => bevestigVerwijderen(teVerwijderen)}
                className="cursor-pointer rounded-full bg-wine px-5 py-2 text-base text-white transition-opacity hover:opacity-85"
              >
                Ja, verwijder
              </button>
              <button
                type="button"
                onClick={() => setTeVerwijderen(null)}
                className="cursor-pointer text-base text-wine/60 transition-opacity hover:opacity-100"
              >
                Nee, laat staan
              </button>
            </div>
          )}

          <ProductList
            producten={producten}
            bezigId={bezigId}
            onBewerk={(product) => setBewerking(product)}
            onVerwijder={(product) => setTeVerwijderen(product)}
          />
        </>
      ) : (
        <div className="pt-6">
          <MateriaalForm />
        </div>
      )}
    </div>
  );
}
