"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BlogPost, Product } from "@/lib/api";
import {
  BeheerFout,
  haalBlogs,
  haalProducten,
  leesToken,
  verwijderBlog,
  verwijderProduct,
  wisToken,
} from "@/lib/beheer";
import { BlogForm } from "./BlogForm";
import { BlogList } from "./BlogList";
import { LoginForm } from "./LoginForm";
import { MateriaalForm } from "./MateriaalForm";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";
import { Knop } from "./Veld";

const TABS = [
  ["producten", "Producten"],
  ["blogs", "Blogs"],
  ["materiaal", "Geldt voor alles"],
] as const;

type Tab = (typeof TABS)[number][0];

/* Welk formulier openstaat. `item` is null bij iets nieuws. */
type Formulier =
  | { soort: "product"; item: Product | null }
  | { soort: "blog"; item: BlogPost | null }
  | null;

export function BeheerApp() {
  const [ingelogd, setIngelogd] = useState(false);
  const [gecontroleerd, setGecontroleerd] = useState(false);
  const [tab, setTab] = useState<Tab>("producten");

  const [producten, setProducten] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState("");
  const [formulier, setFormulier] = useState<Formulier>(null);
  const [teVerwijderen, setTeVerwijderen] = useState<
    { soort: "product" | "blog"; id: string; naam: string } | null
  >(null);
  const [bezigId, setBezigId] = useState<string | null>(null);

  /* Een token in de opslag zegt alleen dat er ooit is ingelogd, niet dat het
     nog geldig is. De eerste aanvraag bewijst dat; een 401 daar gooit het
     token weg en zet ons terug op het inlogscherm. */
  useEffect(() => {
    setIngelogd(leesToken() !== null);
    setGecontroleerd(true);
  }, []);

  /* De tab staat in de URL (/beheer#blogs). Zo blijft hij staan als de pagina
     opnieuw laadt, en is een bepaald onderdeel te bookmarken. */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (TABS.some(([sleutel]) => sleutel === hash)) setTab(hash as Tab);
  }, []);

  function kiesTab(nieuweTab: Tab) {
    setTab(nieuweTab);
    window.history.replaceState(null, "", `#${nieuweTab}`);
  }

  const laadAlles = useCallback(async () => {
    setLaden(true);
    setFout("");
    try {
      const [p, b] = await Promise.all([haalProducten(), haalBlogs()]);
      setProducten(p);
      setBlogs(b);
    } catch (error) {
      if (error instanceof BeheerFout && error.status === 401) {
        setIngelogd(false);
        return;
      }
      setFout(
        error instanceof BeheerFout
          ? error.message
          : "De gegevens konden niet geladen worden.",
      );
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => {
    if (ingelogd) laadAlles();
  }, [ingelogd, laadAlles]);

  /*
   * Het formulier is geen eigen route maar wel een eigen scherm, en de
   * terugknop van de browser sprong daardoor in een keer het beheer uit. Bij
   * het openen zetten we er een stap bij; sluiten gaat via history.back(), dan
   * verdwijnt die stap ook weer en blijft de geschiedenis kloppen.
   */
  const formulierOpen = formulier !== null;

  useEffect(() => {
    if (!formulierOpen) return;
    window.history.pushState({ beheerFormulier: true }, "");
    function sluit() {
      setFormulier(null);
    }
    window.addEventListener("popstate", sluit);
    return () => window.removeEventListener("popstate", sluit);
  }, [formulierOpen]);

  function sluitFormulier() {
    window.history.back();
  }

  function uitloggen() {
    wisToken();
    setIngelogd(false);
    setProducten([]);
    setBlogs([]);
    setFormulier(null);
  }

  async function bevestigVerwijderen() {
    if (!teVerwijderen) return;
    const { soort, id } = teVerwijderen;
    setBezigId(id);
    setFout("");
    try {
      if (soort === "product") {
        await verwijderProduct(id);
        setProducten((vorige) => vorige.filter((p) => p.id !== id));
      } else {
        await verwijderBlog(id);
        setBlogs((vorige) => vorige.filter((b) => b.id !== id));
      }
      setTeVerwijderen(null);
    } catch (error) {
      setFout(
        error instanceof BeheerFout ? error.message : "Verwijderen mislukt.",
      );
    } finally {
      setBezigId(null);
    }
  }

  function naProduct(bewaard: Product) {
    setProducten((vorige) =>
      vorige.some((p) => p.id === bewaard.id)
        ? vorige.map((p) => (p.id === bewaard.id ? bewaard : p))
        : [...vorige, bewaard],
    );
    sluitFormulier();
  }

  function naBlog(bewaard: BlogPost) {
    setBlogs((vorige) =>
      vorige.some((b) => b.id === bewaard.id)
        ? vorige.map((b) => (b.id === bewaard.id ? bewaard : b))
        : [...vorige, bewaard],
    );
    sluitFormulier();
  }

  /* Niets tonen tot we weten of er een token is: anders flitst het
     inlogscherm bij iedereen die al ingelogd was. */
  if (!gecontroleerd) return null;

  if (!ingelogd) {
    return <LoginForm onIngelogd={() => setIngelogd(true)} />;
  }

  if (formulier) {
    const titel =
      formulier.item
        ? formulier.soort === "product"
          ? (formulier.item as Product).name
          : (formulier.item as BlogPost).title
        : formulier.soort === "product"
          ? "Nieuw product"
          : "Nieuw artikel";

    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <button
          type="button"
          onClick={sluitFormulier}
          className="cursor-pointer text-[0.9rem] text-wine/55 transition-colors hover:text-wine"
        >
          &larr; Terug naar het overzicht
        </button>
        <h1 className="mt-4 mb-6 font-display text-2xl text-wine">{titel}</h1>

        {formulier.soort === "product" ? (
          <ProductForm
            product={formulier.item as Product | null}
            onKlaar={naProduct}
            onAnnuleer={sluitFormulier}
          />
        ) : (
          <BlogForm
            blog={formulier.item as BlogPost | null}
            onKlaar={naBlog}
            onAnnuleer={sluitFormulier}
          />
        )}
      </div>
    );
  }

  const nieuwLabel = tab === "blogs" ? "Nieuw artikel" : "Nieuw product";

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-wine">Veramiek beheer</h1>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-[0.9rem] text-wine/60 transition-colors hover:bg-wine/5 hover:text-wine"
          >
            Naar de website
          </Link>
          <Knop type="button" onClick={uitloggen}>
            Uitloggen
          </Knop>
        </div>
      </header>

      <nav className="mt-8 flex gap-1 border-b border-wine/12">
        {TABS.map(([sleutel, label]) => (
          <button
            key={sleutel}
            type="button"
            onClick={() => kiesTab(sleutel)}
            className={`-mb-px cursor-pointer border-b-2 px-3 py-2.5 text-[0.9rem] font-medium transition-colors ${
              tab === sleutel
                ? "border-wine text-wine"
                : "border-transparent text-wine/45 hover:text-wine"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div aria-live="polite">
        {fout && (
          <p className="mt-4 rounded-md bg-wine/5 px-3 py-2 text-[0.9rem] text-wine">
            {fout}
          </p>
        )}
      </div>

      {teVerwijderen && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-wine/20 bg-white p-4">
          <p className="flex-1 text-[0.95rem] text-wine">
            {teVerwijderen.naam} definitief verwijderen?
          </p>
          <Knop type="button" soort="vol" onClick={bevestigVerwijderen}>
            Ja, verwijder
          </Knop>
          <Knop type="button" onClick={() => setTeVerwijderen(null)}>
            Nee, laat staan
          </Knop>
        </div>
      )}

      {tab === "materiaal" ? (
        <div className="mt-6">
          <MateriaalForm />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between py-5">
            <p className="text-[0.9rem] text-wine/50">
              {laden
                ? "Bezig met laden..."
                : tab === "blogs"
                  ? `${blogs.length} ${blogs.length === 1 ? "artikel" : "artikelen"}`
                  : `${producten.length} producten`}
            </p>
            <Knop
              type="button"
              soort="vol"
              onClick={() =>
                setFormulier(
                  tab === "blogs"
                    ? { soort: "blog", item: null }
                    : { soort: "product", item: null },
                )
              }
            >
              {nieuwLabel}
            </Knop>
          </div>

          {tab === "blogs" ? (
            <BlogList
              blogs={blogs}
              bezigId={bezigId}
              onBewerk={(blog) => setFormulier({ soort: "blog", item: blog })}
              onVerwijder={(blog) =>
                setTeVerwijderen({ soort: "blog", id: blog.id, naam: blog.title })
              }
            />
          ) : (
            <ProductList
              producten={producten}
              bezigId={bezigId}
              onBewerk={(product) =>
                setFormulier({ soort: "product", item: product })
              }
              onVerwijder={(product) =>
                setTeVerwijderen({
                  soort: "product",
                  id: product.id,
                  naam: product.name,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
