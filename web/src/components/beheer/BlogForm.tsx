"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/api";
import { BeheerFout, bewerkBlog, maakBlog, uploadFoto } from "@/lib/beheer";
import { Blok, FotoKiezer, Knop, Tekstvlak, Veld } from "./Veld";

type Props = {
  blog: BlogPost | null;
  onKlaar: (bewaard: BlogPost) => void;
  onAnnuleer: () => void;
};

type Foto = { src: string; alt: string };

type Formulier = {
  title: string;
  slug: string;
  meta: string;
  excerpt: string;
  datum: string;
  tekst: string;
  image: string;
  alt: string;
  gallery: Foto[];
  published: boolean;
};

/*
 * De API bewaart de datum als YYYY-MM-DD, maar dat leest niemand hier zo.
 * In het scherm staat DD/MM/YYYY en de omzetting gebeurt op deze twee plekken.
 * Onherkenbare invoer wordt leeg: liever geen datum dan een verkeerde, want
 * hij belandt in de Google-markup van het artikel.
 */
function datumNaarScherm(waarde: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(waarde ?? "").trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function datumNaarApi(waarde: string): string {
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(waarde.trim());
  if (!m) return "";
  const dag = m[1].padStart(2, "0");
  const maand = m[2].padStart(2, "0");
  return `${m[3]}-${maand}-${dag}`;
}

function naarFormulier(blog: BlogPost | null): Formulier {
  return {
    title: blog?.title ?? "",
    slug: blog?.slug ?? "",
    meta: blog?.meta ?? "",
    excerpt: blog?.excerpt ?? "",
    datum: datumNaarScherm(blog?.datePublished),
    /* Alinea's worden gescheiden door een lege regel; dat is hoe iemand een
       tekst toch al typt, en het bespaart een aparte editor. */
    tekst: (blog?.body ?? []).join("\n\n"),
    image: blog?.image ?? "",
    alt: blog?.alt ?? "",
    gallery: (blog?.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt })),
    published: blog?.published !== false,
  };
}

export function BlogForm({ blog, onKlaar, onAnnuleer }: Props) {
  const [waarden, setWaarden] = useState<Formulier>(() => naarFormulier(blog));
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [uploadBezig, setUploadBezig] = useState<"hoofd" | "gallerij" | null>(null);
  const hoofdKiezer = useRef<HTMLInputElement>(null);
  const gallerijKiezer = useRef<HTMLInputElement>(null);

  function zet<K extends keyof Formulier>(sleutel: K, waarde: Formulier[K]) {
    setWaarden((vorige) => ({ ...vorige, [sleutel]: waarde }));
  }

  async function upload(
    e: React.ChangeEvent<HTMLInputElement>,
    doel: "hoofd" | "gallerij",
  ) {
    const bestand = e.target.files?.[0];
    if (!bestand) return;
    setUploadBezig(doel);
    setFout("");
    try {
      const url = await uploadFoto(bestand);
      setWaarden((vorige) =>
        doel === "hoofd"
          ? { ...vorige, image: url }
          : { ...vorige, gallery: [...vorige.gallery, { src: url, alt: "" }] },
      );
    } catch (error) {
      setFout(error instanceof BeheerFout ? error.message : "Uploaden mislukt.");
    } finally {
      setUploadBezig(null);
      const kiezer = doel === "hoofd" ? hoofdKiezer : gallerijKiezer;
      if (kiezer.current) kiezer.current.value = "";
    }
  }

  function zetGallerijAlt(index: number, alt: string) {
    setWaarden((vorige) => ({
      ...vorige,
      gallery: vorige.gallery.map((foto, i) => (i === index ? { ...foto, alt } : foto)),
    }));
  }

  function verwijderUitGallerij(index: number) {
    setWaarden((vorige) => ({
      ...vorige,
      gallery: vorige.gallery.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!waarden.title.trim()) {
      setFout("Een titel is verplicht.");
      return;
    }
    setBezig(true);
    setFout("");

    const nieuw: Partial<BlogPost> = {
      title: waarden.title.trim(),
      slug: waarden.slug.trim(),
      meta: waarden.meta.trim(),
      excerpt: waarden.excerpt.trim(),
      datePublished: datumNaarApi(waarden.datum),
      body: waarden.tekst
        .split(/\n\s*\n/)
        .map((alinea) => alinea.trim())
        .filter(Boolean),
      image: waarden.image,
      alt: waarden.alt.trim(),
      gallery: waarden.gallery,
      published: waarden.published,
    };

    try {
      const bewaard = blog
        ? await bewerkBlog(blog.id, nieuw)
        : await maakBlog(nieuw);
      onKlaar(bewaard);
    } catch (error) {
      setFout(error instanceof BeheerFout ? error.message : "Opslaan mislukt.");
    } finally {
      setBezig(false);
    }
  }

  const aantalAlinea = waarden.tekst.split(/\n\s*\n/).filter((a) => a.trim()).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28">
      <Blok titel="Het artikel">
        <Veld
          id="b-titel"
          label="Titel"
          verplicht
          waarde={waarden.title}
          onChange={(v) => zet("title", v)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id="b-meta"
            label="Bovenschrift"
            waarde={waarden.meta}
            onChange={(v) => zet("meta", v)}
            placeholder="Het begin, 2025"
            uitleg="Klein regeltje boven de titel."
          />
          <Veld
            id="b-datum"
            label="Datum"
            waarde={waarden.datum}
            onChange={(v) => zet("datum", v)}
            placeholder="23/08/2026"
            uitleg="Mag leeg blijven. Alleen invullen als de datum echt klopt."
          />
        </div>
        <Veld
          id="b-slug"
          label="Adres van de pagina"
          waarde={waarden.slug}
          onChange={(v) => zet("slug", v)}
          placeholder="hoe-veramiek-ontstond"
          uitleg={
            waarden.slug.trim()
              ? `Wordt veramiek.nl/blog/${waarden.slug.trim()}`
              : "Laat leeg, dan maak ik er zelf een van de titel."
          }
        />
        <Tekstvlak
          id="b-excerpt"
          label="Korte inleiding"
          regels={3}
          waarde={waarden.excerpt}
          onChange={(v) => zet("excerpt", v)}
          placeholder="Twee zinnen die nieuwsgierig maken."
          uitleg="Dit staat op de overzichtspagina en in Google."
        />
      </Blok>

      <Blok titel="De tekst">
        <Tekstvlak
          id="b-tekst"
          label="Het verhaal"
          regels={16}
          waarde={waarden.tekst}
          onChange={(v) => zet("tekst", v)}
          placeholder={"Eerste alinea.\n\nTweede alinea."}
          uitleg={`Laat een regel leeg om een nieuwe alinea te beginnen. Nu ${aantalAlinea} ${
            aantalAlinea === 1 ? "alinea" : "alinea's"
          }.`}
        />
      </Blok>

      <Blok titel="Hoofdfoto" uitleg="De grote foto bovenaan en op het overzicht.">
        {waarden.image && (
          <div className="flex items-start gap-4">
            <Image
              src={waarden.image}
              alt=""
              width={160}
              height={90}
              unoptimized
              className="h-24 w-40 rounded-md object-cover"
            />
            <Knop type="button" onClick={() => zet("image", "")}>
              Weghalen
            </Knop>
          </div>
        )}
        <FotoKiezer
          id="b-foto-hoofd"
          label={waarden.image ? "Andere foto kiezen" : "Foto kiezen"}
          bezig={uploadBezig === "hoofd"}
          onKies={(e) => upload(e, "hoofd")}
          invoerRef={hoofdKiezer}
        />
        <Veld
          id="b-alt"
          label="Wat staat er op de foto"
          waarde={waarden.alt}
          onChange={(v) => zet("alt", v)}
          placeholder="Vera achter de draaischijf in haar atelier"
          uitleg="Voor wie de foto niet kan zien, en voor Google."
        />
      </Blok>

      <Blok
        titel="Foto's in het artikel"
        uitleg="Staan halverwege het stuk, naast elkaar."
      >
        {waarden.gallery.length > 0 && (
          <ul className="space-y-4">
            {waarden.gallery.map((foto, index) => (
              <li key={foto.src} className="flex items-start gap-4">
                <Image
                  src={foto.src}
                  alt=""
                  width={72}
                  height={96}
                  unoptimized
                  className="h-24 w-18 rounded-md object-cover"
                />
                <Veld
                  id={`b-gal-${index}`}
                  label="Wat staat erop"
                  waarde={foto.alt}
                  onChange={(v) => zetGallerijAlt(index, v)}
                  className="flex-1"
                />
                <Knop type="button" onClick={() => verwijderUitGallerij(index)}>
                  Weg
                </Knop>
              </li>
            ))}
          </ul>
        )}
        <FotoKiezer
          id="b-foto-gallerij"
          label="Foto toevoegen"
          bezig={uploadBezig === "gallerij"}
          onKies={(e) => upload(e, "gallerij")}
          invoerRef={gallerijKiezer}
        />
      </Blok>

      <Blok titel="Zichtbaarheid">
        <label className="flex cursor-pointer items-center gap-3 text-[0.95rem] text-wine">
          <input
            type="checkbox"
            checked={waarden.published}
            onChange={(e) => zet("published", e.target.checked)}
            className="h-4 w-4 accent-wine"
          />
          Zichtbaar op de site
        </label>
        <p className="text-[0.85rem] text-wine/50">
          Zonder tekst verschijnt het artikel wel als tegel op de homepage, maar
          krijgt het nog geen eigen pagina.
        </p>
      </Blok>

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
