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
  /** Grid-plaatsing + verhouding per tegel, zodat de wand niet uit vier identieke kaarten bestaat. */
  tileClass: string;
};

export const collections: Collection[] = [
  {
    name: "Dune & Dust",
    href: "/#collecties",
    image: "/images/schaal-1.png",
    alt: "Handgedraaide schaal uit de collectie Dune & Dust",
    tileClass: "md:col-span-7 aspect-[3/4] md:aspect-[4/3]",
  },
  {
    name: "Blush",
    href: "/#collecties",
    image: "/images/bubble-cups.png",
    alt: "Bubble cups uit de collectie Blush",
    tileClass: "md:col-span-5 aspect-[3/4] md:aspect-auto md:h-full",
  },
  {
    name: "Boeren bontjes",
    href: "/#collecties",
    image: "/images/letters.png",
    alt: "Beschilderd keramiek uit de collectie Boeren bontjes",
    tileClass: "md:col-span-5 aspect-[3/4] md:aspect-[5/4]",
  },
  {
    name: "Placeholder",
    href: "/#collecties",
    image: "/images/matcha-set.png",
    alt: "Matcha set uit een nieuwe collectie",
    tileClass: "md:col-span-7 aspect-[3/4] md:aspect-auto md:h-full",
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
};

export const blogPosts: BlogPost[] = [
  {
    title: "Uit de oven: de eerste stook van het seizoen",
    excerpt:
      "De oven ging voor het eerst dit seizoen op temperatuur. Wat er na twaalf uur wachten uit kwam, had ik zelf niet verwacht.",
    image: "/images/kopjes.png",
    alt: "Vers gebakken kopjes op een plank in het atelier",
    meta: "Stoken, 2026",
    layoutClass: "col-span-12 md:col-span-7 md:row-span-2",
    aspectClass: "aspect-[4/3] md:aspect-[4/5]",
  },
  {
    title: "Geen twee glazuren zijn hetzelfde",
    excerpt:
      "Hetzelfde recept, dezelfde oven, en toch elke keer een ander resultaat. Over de mooie eigenwijsheid van glazuur.",
    image: "/images/chip-and-dip-1.png",
    alt: "Geglazuurde chip and dip schaal",
    meta: "Glazuur, 2026",
    layoutClass: "col-span-12 md:col-span-5 md:col-start-8 md:translate-y-10",
    aspectClass: "aspect-[4/3] md:aspect-[4/5]",
  },
  {
    title: "Een ochtend in het atelier",
    excerpt:
      "Koffie, klei en een stapel schetsen. Zo ziet een gewone ochtend achter de draaischijf eruit.",
    image: "/images/studio-hero.webp",
    alt: "Werkbank met klei en gereedschap in het atelier",
    meta: "Atelier, 2025",
    layoutClass: "col-span-12 md:col-span-5 md:col-start-8 md:translate-y-12",
    aspectClass: "aspect-[4/3] md:aspect-[16/10]",
  },
  {
    title: "Draaien leer je met je handen",
    excerpt:
      "Je kunt er tien boeken over lezen, maar centreren leer je pas als de klei tussen je vingers wegglipt.",
    image: "/images/schaaltje-2.png",
    alt: "Handgedraaid schaaltje",
    meta: "Techniek, 2026",
    layoutClass: "col-span-12 md:col-span-4 md:col-start-1 md:-translate-y-8",
    aspectClass: "aspect-[4/3] md:aspect-[3/4]",
  },
  {
    title: "Van klomp klei tot diep bord",
    excerpt:
      "Zeven stappen, drie weken en één moment van paniek bij het afdraaien. Het verhaal van een diep bord.",
    image: "/images/diep-bord.png",
    alt: "Diep bord met glazuur",
    meta: "Proces, 2025",
    layoutClass: "col-span-12 md:col-span-5 md:col-start-6 md:translate-y-6",
    aspectClass: "aspect-[4/3] md:aspect-[5/4]",
  },
  {
    title: "Kleine dingen, veel geduld",
    excerpt:
      "Lepelhouders lijken simpel, tot je er twintig achter elkaar maakt en er zes de oven overleven.",
    image: "/images/lepel-dingen.png",
    alt: "Handgemaakte lepelhouders",
    meta: "Detail, 2026",
    layoutClass: "col-span-12 md:col-span-3 md:col-start-1 md:-translate-y-14",
    aspectClass: "aspect-[4/3] md:aspect-[3/4]",
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
