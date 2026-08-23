/**
 * Getypeerde client voor de Veramiek Express-API (../../api/server.js).
 * Alle data (producten, content, workshops, beschikbaarheid) komt hier live
 * vandaan; bestellingen, contact- en boekingsberichten gaan er via mail
 * doorheen.
 *
 * Twee basis-URL's, bewust gescheiden:
 * - Browser: NEXT_PUBLIC_API_BASE. In productie is dat het relatieve `/api`,
 *   zodat elke aanroep same-origin is. Dat scheelt CORS (de API kent alleen
 *   veramiek.nl als origin) en werkt daardoor ook op een stagingdomein.
 * - Server (SSR in de Next-container): API_BASE_INTERNAL, dat rechtstreeks
 *   naar de API-container wijst. Zonder die variabele zou een SSR-fetch via
 *   het publieke domein naar buiten en weer naar binnen lopen.
 */

function normalize(base: string): string {
  return base.replace(/\/$/, "");
}

/** Basis voor fetches vanuit de browser. */
const CLIENT_API_BASE = normalize(
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001",
);

/** Basis voor fetches vanuit de server; valt terug op de publieke basis. */
const SERVER_API_BASE = normalize(
  process.env.API_BASE_INTERNAL ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:3001",
);

/** Bouwt een API-URL, passend bij waar de code draait. */
function apiUrl(path: string): string {
  const base = typeof window === "undefined" ? SERVER_API_BASE : CLIENT_API_BASE;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ── Producten ─────────────────────────────────────────────────────── */

export type Product = {
  id: string;
  name: string;
  desc: string;
  /** Prijs in euro's (number), zoals de API 'm opslaat. */
  price: number;
  /** Ruwe categorie zoals opgeslagen (bv. "mokken", "overige"). */
  category: string;
  /** Collectienaam (bv. "Zeeuws Zand"); leeg als het product bij geen collectie hoort. */
  collection?: string;
  badge: string | null;
  /** Absolute http(s)-URLs naar geüploade foto's, of lokale /images-paden bij seed. */
  images: string[];
  available?: boolean;
  /** Aantal dat op voorraad ligt; null of undefined betekent niet geteld. */
  stock?: number | null;
  /** Afmeting zoals Vera 'm opgeeft, bv. "9 x 8 cm". */
  size?: string;
  /** Inhoud in ml, alleen bij iets om uit te eten of drinken. */
  volume?: string;
  /** Glazuur van dit stuk; verschilt per collectie, dus niet gedeeld. */
  glaze?: string;
  /** Een zin over waar het voor is. */
  purpose?: string;
  /** Het langere verhaal bij het stuk; dit draagt de productpagina. */
  story?: string;
};

/**
 * Distincte collectienamen die daadwerkelijk in de producten voorkomen,
 * in de volgorde waarin ze voor het eerst opduiken. Basis voor het
 * collectie-filter in de winkel.
 */
export function productCollections(products: Product[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of products) {
    const c = (p.collection ?? "").trim();
    if (c && !seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

/** Categorie-labels voor de winkel-filter (moeten sporen met productCategories in content.ts). */
export const SHOP_CATEGORIES = [
  "Borden",
  "Mokken",
  "Schalen",
  "Kommen",
  "Matcha set",
  "Lepelhouders",
  "Overige",
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

/**
 * Normaliseert een ruwe product-categorie naar één van de SHOP_CATEGORIES.
 * Onbekende of lege categorieën vallen terug op "Overige".
 */
export function normalizeCategory(raw: string | null | undefined): ShopCategory {
  const value = (raw ?? "").trim().toLowerCase();
  const match = SHOP_CATEGORIES.find((c) => c.toLowerCase() === value);
  return match ?? "Overige";
}

/** Formatteert een prijs als "€ 17,95" (NL-notatie). */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/**
 * Haalt alle beschikbare producten op. Server-side gebruikt (geen cache:
 * de winkel moet Vera's admin-wijzigingen direct tonen). Faalt zacht met
 * een lege lijst zodat de pagina blijft renderen als de API plat ligt.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(apiUrl("/products"), { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Product[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Haalt één product op id; null als het niet bestaat of niet beschikbaar is. */
export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id && p.available !== false) ?? null;
}

/* ── Site-content ──────────────────────────────────────────────────── */

/**
 * Een blogartikel zoals de API het bewaart.
 *
 * Let op het verschil tussen twee soorten "af": `published` bepaalt of het
 * artikel op de site verschijnt, `body` of het een eigen pagina krijgt. Een
 * zichtbaar artikel zonder alinea's is een aankondiging op de homepage waar
 * de tekst nog voor moet komen. Zo deed de site het al voordat blogs in het
 * beheerscherm kwamen.
 */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Klein bovenschrift, bv. "Het begin, 2025". */
  meta: string;
  image: string;
  alt: string;
  /** YYYY-MM-DD, leeg als er geen echte datum bekend is. */
  datePublished?: string;
  body?: string[];
  gallery?: { src: string; alt: string; objectPosition?: string }[];
  published?: boolean;
  /** Wine-duotoon over het beeld, opmaakdetail uit de oorspronkelijke opzet. */
  tinted?: boolean;
  /** Uitsnedepunt voor staande foto's in een liggend kader. */
  objectPosition?: string;
};

/** Alle zichtbare blogartikelen; lege lijst bij een fout. */
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(apiUrl("/blogs"), { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

/**
 * Een stuk waarvan er nul op voorraad liggen kun je niet in de winkelwagen
 * leggen, maar wel aanvragen: Vera maakt alles met de hand, dus ze kan het
 * opnieuw maken.
 *
 * Let op het verschil met `stock == null`: dat betekent "niet geteld" en zegt
 * dus niets over beschikbaarheid. Alleen een harde nul telt.
 */
export function isOpAanvraag(product: Product): boolean {
  return product.stock === 0;
}

/** Alleen de artikelen met een geschreven tekst; die krijgen een eigen pagina. */
export function metArtikel(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.body?.length);
}

export type SiteContent = {
  hero?: Record<string, string>;
  about?: Record<string, string>;
  workshop?: Record<string, string>;
  contact?: {
    title?: string;
    desc?: string;
    phone?: string;
    whatsappUrl?: string;
    email?: string;
    location?: string;
    instagramUrl?: string;
    instagramHandle?: string;
    tiktokUrl?: string;
    tiktokHandle?: string;
  };
  footer?: Record<string, string>;
  /** Geldt voor het hele assortiment, niet per product. */
  material?: {
    clay?: string;
    dishwasher?: string;
    microwave?: string;
    oven?: string;
    maintenance?: string;
  };
};

/** Haalt de redactionele site-content op; leeg object bij een fout. */
export async function getContent(): Promise<SiteContent> {
  try {
    const res = await fetch(apiUrl("/content"), { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as SiteContent;
  } catch {
    return {};
  }
}

/* ── Bestelling (winkelwagen → e-mail) ─────────────────────────────── */

/** Regelvorm die /send-order verwacht: naam, aantal en subtotaal als string. */
export type OrderItem = {
  name: string;
  qty: number;
  subtotal: string;
};

export type OrderPayload = {
  naam: string;
  email: string;
  tel: string;
  adres: string;
  items: OrderItem[];
  totaal: string;
  /** Honeypot; leeg laten. Ingevuld = bot → server negeert stil. */
  website?: string;
};

export type ApiResult = { ok: true } | { ok: false; error: string };

async function postJson(path: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Er ging iets mis." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Geen verbinding met de server." };
  }
}

/** Verstuurt een bestelling; de API mailt Vera + de koper. */
export function sendOrder(payload: OrderPayload): Promise<ApiResult> {
  return postJson("/send-order", payload);
}

/* ── Contactformulier ──────────────────────────────────────────────── */

export type ContactPayload = {
  naam: string;
  email: string;
  onderwerp: string;
  bericht: string;
  /** Honeypot; leeg laten. */
  website?: string;
};

/** Verstuurt een contactbericht; de API mailt Vera + een bevestiging. */
export function sendContact(payload: ContactPayload): Promise<ApiResult> {
  return postJson("/send-contact", payload);
}

/* ── Workshops & boekingen ─────────────────────────────────────────── */

export type Workshop = {
  id: string;
  name: string;
  desc: string;
  duration: string;
  groupSize: string;
  price: string;
  images: string[];
};

/** Haalt de workshoptypes op; lege lijst bij een fout. */
export async function getWorkshops(): Promise<Workshop[]> {
  try {
    const res = await fetch(apiUrl("/workshops"), { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Workshop[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export type DayStatus = "free" | "full" | "blocked";

/** Beschikbaarheid per datum (YYYY-MM-DD → status) voor een maand. */
export type Availability = Record<string, DayStatus>;

/**
 * Haalt de beschikbaarheid voor een maand op (bv. "2026-07").
 * Datums die niet in de map staan gelden als vrij.
 */
export async function getAvailability(maand: string): Promise<Availability> {
  try {
    const res = await fetch(
      apiUrl(`/availability?maand=${encodeURIComponent(maand)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return {};
    return (await res.json()) as Availability;
  } catch {
    return {};
  }
}

export type BookingPayload = {
  workshopId: string;
  /** YYYY-MM-DD; leeg als de aanvrager nog geen voorkeursdatum heeft. */
  datum?: string;
  naam: string;
  email: string;
  tel: string;
  aantalPersonen: number;
  bericht?: string;
  /** Honeypot; leeg laten. */
  website?: string;
};

/** Maakt een boekingsaanvraag; de API mailt Vera + de deelnemer met .ics. */
export function createBooking(payload: BookingPayload): Promise<ApiResult> {
  return postJson("/book", payload);
}
