/**
 * Alle placeholder-content op één plek, zodat teksten, foto's en links
 * later zonder component-wijzigingen vervangen kunnen worden.
 */

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
 * De `soort`-query preselecteert het filter op de winkelpagina; labels
 * moeten sporen met SHOP_CATEGORIES in lib/api.ts.
 */
export const productCategories: NavLink[] = [
  { label: "Borden", href: "/collecties?soort=Borden" },
  { label: "Mokken", href: "/collecties?soort=Mokken" },
  { label: "Schalen", href: "/collecties?soort=Schalen" },
  { label: "Kommen", href: "/collecties?soort=Kommen" },
  { label: "Matcha set", href: "/collecties?soort=Matcha%20set" },
  { label: "Lepelhouders", href: "/collecties?soort=Lepelhouders" },
  { label: "Overige", href: "/collecties?soort=Overige" },
];

export type BlogPost = {
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  /** Klein getrackt meta-label boven de tegel (categorie + jaar), redactioneel. */
  meta: string;
  /** Wine-duotoon filter over het beeld (voor sommige kleine tegels, zoals in de referentie). */
  tinted?: boolean;
  /**
   * Uitsnedepunt voor staande foto's in het liggende kader van de carrousel,
   * zelfde patroon als accordionObjectPosition bij de collecties.
   */
  objectPosition?: string;
  /** URL-deel: /blog/<slug>. */
  slug: string;
  /**
   * De alinea's van het volledige artikel. Alleen posts met een body krijgen een
   * eigen pagina en een "Lees verder"-link; de rest is nog een placeholder
   * waarvan de tekst nog moet komen.
   */
  body?: string[];
  /**
   * Extra foto's binnen het artikel, naast elkaar getoond na de tweede alinea.
   * Alleen op de blogpagina zelf; de carrousel gebruikt `image`.
   */
  gallery?: { src: string; alt: string; objectPosition?: string }[];
};

/** De eerste drie posts vullen de carrousel op de homepage (zie BlogTeaser). */
export const CAROUSEL_POST_COUNT = 3;

/** Alleen de posts die daadwerkelijk een artikel hebben. */
export function publishedPosts() {
  return blogPosts.filter((post) => post.body?.length);
}

export function findPost(slug: string) {
  return publishedPosts().find((post) => post.slug === slug);
}

export const blogPosts: BlogPost[] = [
  {
    slug: "hoe-veramiek-ontstond",
    title: "Hoe Veramiek ontstond",
    excerpt:
      "In september 2025 begon ik aan een cursus keramiek, zonder enig idee waar het toe zou leiden. Vanaf de eerste les voelde ik het: dit is helemaal mijn ding.",
    image: "/images/vera-kopje-schotel.webp",
    alt: "Vera drinkt uit een zelfgemaakte mok, met een bord in haar hand",
    meta: "Het begin, 2025",
    tinted: true,
    // Staande foto: hoog uitsnijden houdt haar gezicht in beeld.
    objectPosition: "50% 22%",
    body: [
      "In september 2025 begon ik aan een cursus keramiek, zonder enig idee waar het toe zou leiden. Vanaf de eerste les voelde ik het: dit is helemaal mijn ding, hoe ik mijn creativiteit erin kwijt kan en rust vind in mijn hoofd. Tijdens een vakantie kocht ik tweedehands mijn eerste draaischijf en een oven. Ineens kon ik thuis écht aan de slag. Op zolder hadden we nog ruimte vrij, en daar ontstond langzaam mijn atelier: eerst een draaischijf, planken om mijn creaties op te zetten, een spiegel, mijn logo aan de muur. Stukje bij beetje groeide het uit tot een plek die helemaal van mij is.",
      "Ik ben begonnen met heel veel oefenen. Ik maakte mooie stukken, maar maakte ook veel fouten waar ik weer van kon leren. Ik maakte stukken voor familie, gaf cadeaus, leerde van mislukkingen en vierde de successen. Daarna ben ik begonnen met het verkopen en kreeg ik steeds meer orders. Zo ontstond Veramiek: vanuit plezier, nieuwsgierigheid en de wens om iets met mijn handen te maken. Een atelier waar ik nu niet alleen mijn eigen keramiek maak, maar ook workshops geef en anderen laat ervaren hoe bijzonder het is om met klei te werken.",
      "Ik kan natuurlijk doen alsof ik een pro ben in wat ik doe, maar dat is niet waar. Iedere dag leer ik weer meer en ik maak nog steeds fouten. Maar dat maakt het ook zo leuk: blijven leren en ontdekken, en natuurlijk met als doel om steeds beter te worden in het vak.",
      "Daarom start ik in september weer met een opleiding, om de technieken en theoretische kennis die je moet hebben als keramist nóg beter te leren kennen. Hier heb ik ontzettend veel zin in en ik zal jullie ook zeker meenemen in dit proces.",
      "Want ja, niemand is perfect en het is uiteindelijk ook gewoon doen. Ik vind het geweldig om jullie hierin mee te nemen en kan niet wachten om nog meer kennis op te doen en dit met jullie te kunnen delen.",
    ],
    gallery: [
      {
        src: "/images/vera-portret-atelier.webp",
        alt: "Vera in haar atelier, met haar werk op de planken achter zich",
      },
      {
        src: "/images/vera-kop-en-schotel.webp",
        alt: "Vera met een zelfgemaakte kop en schotel in haar atelier",
      },
    ],
  },
  {
    slug: "nieuwe-uitdaging-vanaf-september",
    title: "Nieuwe uitdaging vanaf september",
    excerpt:
      "Vanaf september volg ik een schooljaar lang elke zaterdagochtend les. Potten met deksels, oren trekken, tuiten draaien en marmeren: alle kneepjes van het vak.",
    image: "/images/vera-atelier-opruimen.webp",
    alt: "Vera aan het werk in haar atelier, met haar logo aan de muur",
    meta: "Het vak leren, 2026",
    // Staande foto: uitsnede op de werkplek en de planken, niet op de vloer.
    objectPosition: "50% 40%",
    body: [
      "Wat jullie misschien al in een eerdere blog hebben gelezen, is dat ik vanaf september weer een cursus ga volgen in de weekenden. Iets waar ik ontzettend veel zin in heb en weer veel ga leren.",
      "Deze cursus is een schooljaar durende cursus op iedere zaterdagochtend. Je leert alle kneepjes van het vak en gaat je verdiepen in verschillende technieken en vaardigheden. Zo gaan we aan de slag met het maken van potten met deksels, oren trekken, tuiten draaien, marmeren, vervormen, groter draaien en nog veel meer.",
      "Iets wat mij ook erg interessant lijkt is meer kennis opdoen over het glazuren en stookproces, iets wat ik al wel doe maar nog niet veel kennis in heb.",
      "Al met al een leuke en nieuwe uitdaging. Ik zal jullie hierin meenemen en kijk uit naar het ontmoeten van de andere cursisten en de progressie die ik ga maken.",
    ],
  },
  {
    slug: "een-ochtend-in-het-atelier",
    title: "Een ochtend in het atelier",
    excerpt:
      "Koffie, klei en een stapel schetsen. Zo ziet een gewone ochtend achter de draaischijf eruit.",
    image: "/images/studio-hero.webp",
    alt: "De kast aan de muur in het atelier, met werk van Veramiek",
    meta: "Atelier, 2025",
    tinted: true,
  },
  {
    slug: "draaien-leer-je-met-je-handen",
    title: "Draaien leer je met je handen",
    excerpt:
      "Je kunt er tien boeken over lezen, maar centreren leer je pas als de klei tussen je vingers wegglipt.",
    image: "/images/schaaltje-2.png",
    alt: "Handgedraaid schaaltje",
    meta: "Techniek, 2026",
  },
  {
    slug: "van-klomp-klei-tot-diep-bord",
    title: "Van klomp klei tot diep bord",
    excerpt:
      "Zeven stappen, drie weken en één moment van paniek bij het afdraaien. Het verhaal van een diep bord.",
    image: "/images/diep-bord.png",
    alt: "Diep bord met glazuur",
    meta: "Proces, 2025",
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
  /** PLACEHOLDER: echte TikTok-handle volgt nog van de klant. */
  tiktokUrl: "https://www.tiktok.com/@veramiek",
};
