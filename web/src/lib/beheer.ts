/**
 * Client voor de beheer-endpoints van de Express-API.
 *
 * De API praat met een Bearer-token dat acht uur geldig is. Dat token staat in
 * sessionStorage en niet in localStorage: sluit ze het tabblad, dan is de
 * sleutel weg. Op een telefoon die blijft rondslingeren scheelt dat.
 *
 * sessionStorage staat in een try/catch, want in de privemodus van iOS gooit
 * de enkele aanroep al een SecurityError en dan valt de hele pagina om.
 */
import type { BlogPost, Product, SiteContent } from "@/lib/api";

const SLEUTEL = "veramiek-beheer-token";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

function kluis(): Storage | null {
  try {
    const t = "__test__";
    window.sessionStorage.setItem(t, t);
    window.sessionStorage.removeItem(t);
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Alleen in het geheugen als sessionStorage niet mag; dan tot een herlading. */
let tokenInGeheugen: string | null = null;

export function leesToken(): string | null {
  if (tokenInGeheugen) return tokenInGeheugen;
  try {
    return kluis()?.getItem(SLEUTEL) ?? null;
  } catch {
    return null;
  }
}

export function bewaarToken(token: string): void {
  tokenInGeheugen = token;
  try {
    kluis()?.setItem(SLEUTEL, token);
  } catch {
    /* geheugen is dan de enige plek, prima */
  }
}

export function wisToken(): void {
  tokenInGeheugen = null;
  try {
    kluis()?.removeItem(SLEUTEL);
  } catch {
    /* niets te wissen */
  }
}

/** Gooit met een leesbare tekst, zodat elk scherm die direct kan tonen. */
export class BeheerFout extends Error {
  readonly status: number;

  constructor(bericht: string, status: number) {
    super(bericht);
    this.name = "BeheerFout";
    this.status = status;
  }
}

async function verzoek<T>(pad: string, init: RequestInit = {}): Promise<T> {
  const token = leesToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${pad}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new BeheerFout("Geen verbinding met de server. Probeer het zo nog eens.", 0);
  }

  /* Verlopen token: meteen opruimen, anders blijft ze op een dood scherm
     kijken zonder te snappen waarom niets werkt. */
  if (res.status === 401) {
    wisToken();
    throw new BeheerFout("Je sessie is verlopen. Log opnieuw in.", 401);
  }

  if (!res.ok) {
    let bericht = "Er ging iets mis. Probeer het nog eens.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) bericht = body.error;
    } catch {
      /* geen json, standaardtekst is dan het beste wat er is */
    }
    throw new BeheerFout(bericht, res.status);
  }

  return (await res.json()) as T;
}

export async function login(wachtwoord: string, code: string): Promise<void> {
  const { token } = await verzoek<{ token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ password: wachtwoord, totp: code }),
  });
  bewaarToken(token);
}

/** Alle producten, dus ook de niet-zichtbare. */
export function haalProducten(): Promise<Product[]> {
  return verzoek<Product[]>("/admin/products");
}

export function maakProduct(product: Partial<Product>): Promise<Product> {
  return verzoek<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function bewerkProduct(id: string, product: Partial<Product>): Promise<Product> {
  return verzoek<Product>(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function verwijderProduct(id: string): Promise<{ ok: true }> {
  return verzoek<{ ok: true }>(`/admin/products/${id}`, { method: "DELETE" });
}

/** Alle blogartikelen, dus ook de niet-zichtbare. */
export function haalBlogs(): Promise<BlogPost[]> {
  return verzoek<BlogPost[]>("/admin/blogs");
}

export function maakBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
  return verzoek<BlogPost>("/admin/blogs", {
    method: "POST",
    body: JSON.stringify(blog),
  });
}

export function bewerkBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
  return verzoek<BlogPost>(`/admin/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(blog),
  });
}

export function verwijderBlog(id: string): Promise<{ ok: true }> {
  return verzoek<{ ok: true }>(`/admin/blogs/${id}`, { method: "DELETE" });
}

export function haalContent(): Promise<SiteContent> {
  return verzoek<SiteContent>("/content");
}

export function bewaarContent(deel: Partial<SiteContent>): Promise<SiteContent> {
  return verzoek<SiteContent>("/admin/content", {
    method: "PUT",
    body: JSON.stringify(deel),
  });
}

export async function uploadFoto(bestand: File): Promise<string> {
  const formulier = new FormData();
  formulier.append("image", bestand);
  const { url } = await verzoek<{ url: string }>("/admin/upload", {
    method: "POST",
    body: formulier,
  });
  return url;
}
