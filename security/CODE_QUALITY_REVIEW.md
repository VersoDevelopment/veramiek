# Veramiek Code Quality & Beauty Review

**Datum:** 2026-06-07
**Scope:** `index.html`, `collectie.html`, `styles.css` (+ `.build/`), `api/server.js`, nginx/Docker.

## Algemeen oordeel
Solide en verzorgd. De backend is netjes, defensief en goed becommentarieerd. De frontend is een opgeschoonde Stitch-export die productieklaar is gemaakt (lokale Tailwind-build i.p.v. CDN, CSP-proof, SEO erin). Geen rommel of dode CDN-resten. Hieronder de punten die de kwaliteit en onderhoudbaarheid verder verhogen, op volgorde van impact.

## Frontend

### 1. Duplicatie tussen pagina's (grootste punt)
Nav, mobiel menu, footer en de bijbehorende JS staan zowel in `index.html` als `collectie.html`. Bij elke navwijziging moet je het op twee plekken doen (zie de recente nav-fixes). Aanrader: kleine include-/buildstap (bv. de Tailwind-build uitbreiden met een simpele HTML-partial via een tool, of een minimale templating-stap) zodat header/footer uit een bron komen. Voor 2 pagina's nog te overzien, maar groeit dit mee, dan wordt het pijnlijk.

### 2. Eén bron voor productdata
De "Uitgelicht"-kaarten en de collectie staan **hardcoded** in de HTML (incl. prijzen zoals `€ 39,95`), terwijl de admin-API (`/products`, `/content`) nog steeds productbeheer biedt dat het nieuwe redesign **niet meer uitleest**. Gevolg: data op twee plekken die uit elkaar kunnen lopen, en een admin-CMS dat losgekoppeld is van de live site. Kies bewust: of de pagina's voeden uit `/products` (zoals de oude site), of de CMS-endpoints opruimen. Nu is het dubbelop.

### 3. Herhaalde inline SVG-logo's
De Instagram/TikTok-SVG's staan vier keer voluit (contact + footer). Eén keer als `<symbol>` definieren en met `<use>` hergebruiken scheelt ruis. Klein puntje.

### 4. Afbeeldingen: CLS en lazy-loading
De `<img>`-tags missen `width`/`height` en `loading="lazy"` (behalve de hero). Dat geeft layout shift en laadt alles direct. Voeg afmetingen + `loading="lazy"`/`decoding="async"` toe op de collectie- en workshop-beelden voor betere Core Web Vitals.

### 5. Progressive enhancement
`.reveal-on-scroll` zet elementen op `opacity:0` en toont ze via IntersectionObserver. Werkt JS niet, dan blijft content onzichtbaar. Overweeg een `<noscript>`-fallback of de start-opacity via een `js`-class te zetten (alleen verbergen als JS aanstaat).

### 6. Kleine consistentie
- `borderRadius.full` is in de config overschreven naar `0.75rem`, dus `rounded-full` is géén cirkel. Dat is bewust (uit de CDN-config), maar verwarrend bij toekomstige edits, het is het vermelden waard in een comment.
- Mix van inline `style="transition-delay"` en utility-classes. Prima, maar inconsistent.

## Backend (`api/server.js`)
Netjes geschreven: `'use strict'`, duidelijke secties, Nederlandse comments, goede inputvalidatie, `escapeHtml`, rate limits, JWT + TOTP-2FA, bcrypt(12), globale error handler, SVG-block en uploadlimiet. Weinig op aan te merken.

Kleine punten:
- **E-mail subject** met ongefilterde `naam` (header). nodemailer vangt CR/LF af; een expliciete `.replace(/[\r\n]/g,' ')` maakt het waterdicht (zie [REAUDIT_2026-06-07.md](REAUDIT_2026-06-07.md)).
- **JSON-bestanden als opslag** is prima op deze schaal; bij gelijktijdige writes is er geen locking. Acceptabel voor één beheerder.
- `adminHash` wordt bij elke start opnieuw uit `ADMIN_PASSWORD` gehasht. Werkt, maar betekent dat het wachtwoord in plaintext in `.env` staat (onvermijdelijk bij dit model). Prima zo.

## Build & deploy
- De `.build/`-opzet (config mirrort de oude CDN-config exact) is een nette, reproduceerbare keuze; `node_modules` genegeerd, map door nginx geblokkeerd.
- **Let op bij toekomstige edits:** na elke class-wijziging in de HTML moet `npm run build` opnieuw draaien, anders mist de utility in `styles.css`. Eventueel een pre-commit hook of `--watch` tijdens ontwikkelen.

## Samengevat
- **Belangrijkste verbeteringen:** (1) nav/footer ontdubbelen, (2) één bron voor productdata kiezen (CMS of hardcoded, niet beide), (3) afbeeldingsafmetingen + lazy-load.
- **Nice-to-have:** CSP aanscherpen door inline JS extern te zetten, SVG's hergebruiken, progressive-enhancement-fallback.
- **Backend:** in goede staat, alleen de subject-sanitisatie als laatste schaafpuntje.
