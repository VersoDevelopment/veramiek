/**
 * Alle placeholder-content op één plek, zodat teksten, foto's en links
 * later zonder component-wijzigingen vervangen kunnen worden.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Collecties", href: "/#collecties" },
  { label: "Over mij", href: "/over-mij" },
  { label: "Workshops", href: "/workshops" },
  { label: "Mijn blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export type Collection = {
  name: string;
  href: string;
  image: string;
  alt: string;
};

/** De eerste drie zijn de uitgelichte rij op de homepage; het megamenu toont alles. */
export const collections: Collection[] = [
  {
    name: "Dune & Dust",
    href: "/#collecties",
    image: "/images/schaal-1.png",
    alt: "Handgedraaide schaal uit de collectie Dune & Dust",
  },
  {
    name: "Blush",
    href: "/#collecties",
    image: "/images/bubble-cups.png",
    alt: "Bubble cups uit de collectie Blush",
  },
  {
    name: "Boeren bontjes",
    href: "/#collecties",
    image: "/images/letters.png",
    alt: "Beschilderd keramiek uit de collectie Boeren bontjes",
  },
  {
    name: "Placeholder",
    href: "/#collecties",
    image: "/images/matcha-set.png",
    alt: "Matcha set uit een nieuwe collectie",
  },
];

/** Product-categorieën voor de rechterkolom van het Collecties-megamenu. */
export const productCategories: NavLink[] = [
  { label: "Borden", href: "/#collecties" },
  { label: "Mokken", href: "/#collecties" },
  { label: "Schalen", href: "/#collecties" },
  { label: "Kommen", href: "/#collecties" },
  { label: "Matcha set", href: "/#collecties" },
  { label: "Lepelhouders", href: "/#collecties" },
  { label: "Overige", href: "/#collecties" },
];

export type BlogPost = {
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  /** Klein getrackt meta-label boven de tegel (categorie + jaar), redactioneel. */
  meta: string;
  /** Handmatig geplaatste grid-positie voor het redactionele raster (12 kolommen). */
  layoutClass: string;
  /** Beeldverhouding per tegel, bewust verschillend. */
  aspectClass: string;
  /** Wine-duotoon filter over het beeld (voor sommige kleine tegels, zoals in de referentie). */
  tinted?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    title: "Hoe Veramiek ontstond",
    excerpt:
      "In september 2025 begon ik aan een cursus keramiek, zonder enig idee waar het toe zou leiden. Vanaf de eerste les voelde ik het: dit is helemaal mijn ding.",
    image: "/images/kopjes.png",
    alt: "Vers gebakken kopjes op een plank in het atelier",
    meta: "Het begin, 2025",
    layoutClass: "col-span-12 md:col-span-2 md:col-start-1",
    aspectClass: "aspect-[4/3] md:aspect-[3/4]",
    tinted: true,
  },
  {
    title: "Geen twee glazuren zijn hetzelfde",
    excerpt:
      "Hetzelfde recept, dezelfde oven, en toch elke keer een ander resultaat. Over de mooie eigenwijsheid van glazuur.",
    image: "/images/chip-and-dip-1.png",
    alt: "Geglazuurde chip and dip schaal",
    meta: "Glazuur, 2026",
    layoutClass: "col-span-12 md:col-span-6 md:col-start-4 md:translate-y-16",
    aspectClass: "aspect-[4/3] md:aspect-[16/10]",
  },
  {
    title: "Een ochtend in het atelier",
    excerpt:
      "Koffie, klei en een stapel schetsen. Zo ziet een gewone ochtend achter de draaischijf eruit.",
    image: "/images/studio-hero.webp",
    alt: "Werkbank met klei en gereedschap in het atelier",
    meta: "Atelier, 2025",
    layoutClass: "col-span-12 md:col-span-2 md:col-start-11 md:translate-y-6",
    aspectClass: "aspect-[4/3] md:aspect-[3/4]",
    tinted: true,
  },
  {
    title: "Draaien leer je met je handen",
    excerpt:
      "Je kunt er tien boeken over lezen, maar centreren leer je pas als de klei tussen je vingers wegglipt.",
    image: "/images/schaaltje-2.png",
    alt: "Handgedraaid schaaltje",
    meta: "Techniek, 2026",
    layoutClass: "col-span-12 md:col-span-3 md:col-start-2",
    aspectClass: "aspect-[4/3] md:aspect-[4/5]",
  },
  {
    title: "Van klomp klei tot diep bord",
    excerpt:
      "Zeven stappen, drie weken en één moment van paniek bij het afdraaien. Het verhaal van een diep bord.",
    image: "/images/diep-bord.png",
    alt: "Diep bord met glazuur",
    meta: "Proces, 2025",
    layoutClass: "col-span-12 md:col-span-5 md:col-start-7 md:translate-y-20",
    aspectClass: "aspect-[4/3] md:aspect-[16/10]",
  },
];

export const contact = {
  /** Echt nummer, door Kenny aangeleverd. */
  whatsappUrl: "https://wa.me/31648145413",
  /** PLACEHOLDER: echt e-mailadres volgt nog van de klant. */
  email: "hallo@veramiek.nl",
  /** PLACEHOLDER: echte Instagram-handle volgt nog van de klant. */
  instagramUrl: "https://www.instagram.com/veramiek",
  instagramHandle: "@veramiek",
};
