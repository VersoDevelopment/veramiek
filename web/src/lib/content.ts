/**
 * Alle placeholder-content op één plek, zodat teksten, foto's en links
 * later zonder component-wijzigingen vervangen kunnen worden.
 */

import { CATEGORY_PAGES } from "./seo";

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Collecties", href: "/collecties" },
  { label: "Over mij", href: "/over-mij" },
  { label: "Workshops", href: "/workshops" },
  { label: "Contact", href: "/contact" },
];

/**
 * Het hamburgermenu toont Blogs, de desktopnav en de footer bewust niet.
 * Afgeleid van navLinks zodat een wijziging daar hier automatisch meekomt.
 */
export const mobileNavLinks: NavLink[] = navLinks.flatMap((link) =>
  link.href === "/contact"
    ? [{ label: "Blogs", href: "/blog" }, link]
    : [link],
);

/**
 * De footer toont Blogs wel. De desktopnav houdt bewust vier items, maar
 * zonder een link hier waren /blog en de artikelen daaronder alleen via het
 * mobiele menu en de sitemap te bereiken: te weinig interne links om Google
 * te laten zien dat ze bij de site horen.
 */
export const footerLinks: NavLink[] = [
  ...navLinks,
  { label: "Blogs", href: "/blog" },
  { label: "Atelier Etten-Leur", href: "/keramiek-etten-leur" },
];

export type Collection = {
  name: string;
  href: string;
  /** Eén of meerdere foto's; bij meerdere wisselt de tegel er automatisch tussen (crossfade). */
  images: string[];
  alt: string;
  /** Foto voor de Collecties-accordion op de homepage (CollectionAccordion). */
  accordionImage: string;
  /** Optionele object-position-correctie voor die foto, bijv. bij een niet-gecentreerd product. */
  accordionObjectPosition?: string;
};

/**
 * De eerste drie vullen de accordion op de homepage; het mobiele menu toont
 * alles wat hier staat. Alleen echte, bestaande collecties dus.
 */
export const collections: Collection[] = [
  {
    name: "Zeeuws Zand",
    href: "/collecties?collectie=Zeeuws%20Zand",
    images: [
      "/images/collecties/zeeuws-zand/zeeuws-zand-1.jpg",
      "/images/collecties/zeeuws-zand/zeeuws-zand-2.jpg",
      "/images/collecties/zeeuws-zand/zeeuws-zand-3.jpg",
    ],
    alt: "Handgedraaid keramiek uit de collectie Zeeuws Zand",
    accordionImage: "/images/collecties/zeeuws-zand/zeeuws-zand-accordion.jpg",
  },
  {
    name: "Kust Koraal",
    href: "/collecties?collectie=Kust%20Koraal",
    images: [
      "/images/collecties/kust-koraal/kust-koraal-1.jpg",
      "/images/collecties/kust-koraal/kust-koraal-2.jpg",
      "/images/collecties/kust-koraal/kust-koraal-3.jpg",
    ],
    alt: "Keramiek uit de collectie Kust Koraal",
    accordionImage: "/images/collecties/kust-koraal/kust-koraal-accordion.jpg",
    accordionObjectPosition: "50% 78%",
  },
  {
    name: "Boeren Bontjes",
    href: "/collecties?collectie=Boeren%20Bontjes",
    images: [
      "/images/collecties/boeren-bontjes/boeren-bontjes-1.jpg",
      "/images/collecties/boeren-bontjes/boeren-bontjes-2.jpg",
      "/images/collecties/boeren-bontjes/boeren-bontjes-3.jpg",
    ],
    alt: "Beschilderd keramiek uit de collectie Boeren Bontjes",
    accordionImage: "/images/collecties/boeren-bontjes/boeren-bontjes-accordion.jpg",
  },
];

/**
 * Product-categorieën voor de rechterkolom van het Collecties-megamenu.
 *
 * Wijzen sinds de SEO-ronde naar de eigen categoriepagina's onder /keramiek/
 * in plaats van naar `/collecties?soort=...`. Die querystring zette alleen een
 * client-side filter en was dus geen indexeerbare pagina: er viel niets te
 * ranken op "handgemaakte mokken" en zoekmachines kregen geen interne links.
 *
 * "Overige" heeft bewust geen eigen pagina (restcategorie zonder zoekvraag) en
 * blijft daarom het oude filter gebruiken.
 */
export const productCategories: NavLink[] = [
  ...CATEGORY_PAGES.map((c) => ({
    label: c.categorie,
    href: `/keramiek/${c.slug}`,
  })),
  { label: "Overige", href: "/collecties?soort=Overige" },
];

/*
 * De blogartikelen stonden hier als vaste lijst. Ze komen nu uit de API, zodat
 * Vera ze in het beheerscherm kan schrijven en aanpassen; het type en de
 * ophaalfunctie staan in lib/api.ts. De oorspronkelijke vijf artikelen zijn
 * eenmalig overgezet naar api/data-seed/blogs.json.
 */

/** De eerste drie artikelen vullen de carrousel op de homepage (zie BlogTeaser). */
export const CAROUSEL_POST_COUNT = 3;

export const contact = {
  /** Echt nummer, door Kenny aangeleverd. */
  whatsappUrl: "https://wa.me/31648145413",
  /**
   * Hetzelfde nummer in E.164, voor de LocalBusiness-markup in layout.tsx.
   * Het staat via de WhatsApp-link toch al publiek op de site.
   */
  phone: "+31648145413",
  email: "info@veramiek.nl",
  instagramUrl: "https://www.instagram.com/veramiek.nl",
  instagramHandle: "@veramiek.nl",
  tiktokUrl: "https://www.tiktok.com/@veramiek",
};
