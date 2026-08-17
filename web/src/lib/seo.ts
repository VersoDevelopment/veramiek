/**
 * Gedeelde SEO-logica: unieke producttitels, categoriepagina's en breadcrumbs.
 *
 * De aanleiding staat in de Search Console-data: zes productnamen komen
 * meerdere keren voor (Chip & Dip Bowl drie keer, Matcha Set, Lepelhouder,
 * Bubble Cups, Schaal en Asbak twee keer). Die pagina's hadden allemaal
 * dezelfde title en description, waardoor Google er zelf een moest kiezen en
 * de rest als bijna-duplicaat behandelde. `productTitle` lost dat op zonder
 * dat Vera iets in het adminpaneel hoeft te hernoemen.
 */

import type { Product } from "./api";
import { normalizeCategory } from "./api";

export const siteUrl = process.env.SITE_URL ?? "https://veramiek.nl";

export const SITE_NAME = "Veramiek";

/**
 * Maakt een pad absoluut voor gebruik in JSON-LD. Anders dan bij `metadata`
 * lost Next hier niets op: wat je in de markup zet, staat er letterlijk.
 * Productfoto's zijn of een geüploade absolute URL, of een lokaal /images-pad
 * (zie Product.images in lib/api.ts), dus beide gevallen moeten er doorheen.
 */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${siteUrl}${path}`;
}

/** Waar het atelier staat; gebruikt in descriptions en in de LocalBusiness-markup. */
export const PLAATS = "Etten-Leur";

/* ── Unieke producttitels ──────────────────────────────────────────── */

/** "Zeeuws Zand" → "zeeuws-zand"; ook geschikt voor namen met & en accenten. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Het onderscheidende deel achter de productnaam, of een lege string als de
 * naam al uniek is. Drie trappen, van mooi naar lelijk:
 *
 * 1. Naam komt één keer voor  → niets toevoegen.
 * 2. Naam + collectie is uniek → de collectienaam ("Zeeuws Zand").
 * 3. Ook dat niet             → het staartje van de id ("Groen").
 *
 * Trap 3 is een vangnet, geen ontwerp. Hij treedt nu alleen op bij de twee
 * asbakken, die in het adminpaneel geen collectie hebben staan. Zodra Vera
 * die invult, schuiven ze vanzelf naar trap 2.
 */
export type ProductVariant = {
  /** Het onderscheidende label, of "" als de naam al uniek is. */
  label: string;
  /**
   * Of `label` een echte collectienaam is. Alleen dan mag de tekst eromheen
   * "uit de collectie ..." zeggen; bij het id-vangnet zou dat een verzonnen
   * collectie suggereren.
   */
  isCollectie: boolean;
};

export function productVariant(
  product: Product,
  all: Product[],
): ProductVariant {
  const sameName = all.filter((p) => p.name === product.name);
  if (sameName.length <= 1) return { label: "", isCollectie: false };

  const collection = (product.collection ?? "").trim();
  if (collection) {
    const sameCollection = sameName.filter(
      (p) => (p.collection ?? "").trim() === collection,
    );
    if (sameCollection.length === 1) {
      return { label: collection, isCollectie: true };
    }
  }

  // Vangnet: wat er van de id overblijft na het naamdeel, bv. "p-asbak-groen"
  // met naam "Asbak" → "groen" → "Groen".
  const namePart = slugify(product.name);
  const rest = slugify(product.id)
    .replace(/^p-/, "")
    .replace(new RegExp(`^${namePart}-?`), "")
    .replace(/-/g, " ")
    .trim();

  if (!rest) return { label: "", isCollectie: false };
  return {
    label: rest.charAt(0).toUpperCase() + rest.slice(1),
    isCollectie: false,
  };
}

/** Volledige, onderscheidende productnaam: "Chip & Dip Bowl, Zeeuws Zand". */
export function productTitle(product: Product, all: Product[]): string {
  const { label } = productVariant(product, all);
  return label ? `${product.name}, ${label}` : product.name;
}

/**
 * Meta-description per product. De `desc` uit het adminpaneel is kort (vaak
 * drie of vier woorden) en bij varianten voor alle exemplaren gelijk, dus die
 * alleen is te mager en niet uniek. Hier komt het onderscheidende deel plus
 * vaste, feitelijke context omheen tot een bruikbare zin.
 */
export function productDescription(product: Product, all: Product[]): string {
  const { label, isCollectie } = productVariant(product, all);
  const kop = isCollectie
    ? `${product.name} uit de collectie ${label}.`
    : label
      ? `${product.name}, uitvoering ${label}.`
      : `${product.name}.`;
  const staart = product.desc?.trim()
    ? `${product.desc.trim()}. Met de hand gedraaid in het atelier in ${PLAATS}, elk stuk is uniek.`
    : `Handgemaakt keramiek, met de hand gedraaid in het atelier in ${PLAATS}. Elk stuk is uniek.`;
  return `${kop} ${staart}`;
}

/* ── Categoriepagina's ─────────────────────────────────────────────── */

export type CategoryPage = {
  /** URL-deel: /keramiek/<slug>. */
  slug: string;
  /** Moet exact sporen met een waarde uit SHOP_CATEGORIES in lib/api.ts. */
  categorie: string;
  /** H1 van de pagina. */
  titel: string;
  /** Title-tag; los van de H1 omdat daar de zoekterm voluit in mag. */
  metaTitel: string;
  /** Meta-description. */
  omschrijving: string;
  /** Inleiding op de pagina zelf. */
  intro: string;
};

/**
 * "Overige" staat hier bewust niet tussen: die categorie is een restbak zonder
 * zoekvraag, en een eigen pagina ervoor zou dun zijn zonder iets op te leveren.
 * Die producten blijven gewoon via /collecties bereikbaar.
 */
export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: "borden",
    categorie: "Borden",
    titel: "Handgemaakte borden",
    metaTitel: "Handgemaakte borden",
    omschrijving:
      `Handgedraaide borden uit het atelier van Vera in ${PLAATS}. Dinerborden, diepe borden, lunchborden en gebaksbordjes, elk stuk uniek.`,
    intro:
      "Dinerborden, diepe borden, lunchborden en gebaksbordjes, allemaal met de hand gedraaid. Omdat elk bord apart op de draaischijf ontstaat, zijn er altijd kleine verschillen in vorm en glazuur. Dat is precies wat handwerk van fabriekswerk onderscheidt.",
  },
  {
    slug: "mokken",
    categorie: "Mokken",
    titel: "Handgemaakte mokken en kopjes",
    metaTitel: "Handgemaakte mokken en kopjes",
    omschrijving:
      `Handgedraaide mokken en kopjes uit het atelier in ${PLAATS}. Voor koffie, thee of matcha, elk exemplaar met de hand gemaakt.`,
    intro:
      "Mokken en kopjes voor je koffie, thee of matcha. Elke mok wordt apart gedraaid en geglazuurd, dus geen twee zijn precies gelijk. Ze gaan generaties mee als je er een beetje op let.",
  },
  {
    slug: "schalen",
    categorie: "Schalen",
    titel: "Handgemaakte schalen",
    metaTitel: "Handgemaakte schalen",
    omschrijving:
      `Handgedraaide serveerschalen en potten uit het atelier in ${PLAATS}, waaronder de Chip & Dip Bowl. Elk stuk is uniek.`,
    intro:
      "Serveerschalen en potten voor op tafel, waaronder de Chip & Dip Bowl met een apart dipdoosje. Met de hand gedraaid, dus elke schaal heeft zijn eigen lijn en glazuurverloop.",
  },
  {
    slug: "kommen",
    categorie: "Kommen",
    titel: "Handgemaakte kommen",
    metaTitel: "Handgemaakte kommen",
    omschrijving:
      `Handgedraaide kommen en schaaltjes uit het atelier in ${PLAATS}. Van spoelkom tot sausbakje, allemaal uniek.`,
    intro:
      "Van een ruime spoelkom voor fruit tot kleine schaaltjes voor sausjes en tapas. Allemaal met de hand gedraaid en per stuk geglazuurd.",
  },
  {
    slug: "matcha-set",
    categorie: "Matcha set",
    titel: "Handgemaakte matcha sets",
    metaTitel: "Handgemaakte matcha set",
    omschrijving:
      `Handgedraaide matcha set met kom en houder, gemaakt in het atelier in ${PLAATS}. Compleet setje, elk stuk uniek.`,
    intro:
      "Een matcha kom met bijpassende houder voor de bezem, als compleet setje. Met de hand gedraaid, dus elk setje is net even anders.",
  },
  {
    slug: "lepelhouders",
    categorie: "Lepelhouders",
    titel: "Handgemaakte lepelhouders",
    metaTitel: "Handgemaakte lepelhouders",
    omschrijving:
      `Handgevormde keramieken lepelhouders uit het atelier in ${PLAATS}. Voor naast het fornuis, elk stuk uniek.`,
    intro:
      "Een plek voor je pollepel naast het fornuis, zodat je aanrecht schoon blijft. Handgevormd keramiek, per stuk geglazuurd.",
  },
];

export function findCategoryPage(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find((c) => c.slug === slug);
}

/** De categoriepagina waar een product op thuishoort, als die bestaat. */
export function categoryPageForProduct(
  product: Product,
): CategoryPage | undefined {
  const categorie = normalizeCategory(product.category);
  return CATEGORY_PAGES.find((c) => c.categorie === categorie);
}

/* ── Gestructureerde data ──────────────────────────────────────────── */

export type Crumb = { naam: string; pad: string };

/**
 * BreadcrumbList-markup. Google gebruikt dit voor het kruimelpad onder de
 * zoekresultaten in plaats van de kale URL, en het maakt de sitestructuur
 * expliciet. De laatste kruimel is de pagina zelf.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.naam,
      item: `${siteUrl}${crumb.pad}`,
    })),
  };
}
