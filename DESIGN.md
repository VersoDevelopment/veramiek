---
name: Veramiek
description: Ambachtelijk keramiekmerk, galerie-achtige minimalistische presentatie van handwerk
colors:
  deep-wine: "#2F0410"
  white: "#FFFFFF"
  pastel-groen: "#CBD1A1"
typography:
  display:
    fontFamily: "Playfair Display, serif"
    fontWeight: 400
    letterSpacing: "0.08em"
    lineHeight: 1.1
  body:
    fontFamily: "Gruppo, sans-serif"
    fontWeight: 400
    fontSize: "1.1875rem"
    lineHeight: 1.6
components:
  button-primary:
    backgroundColor: "{colors.deep-wine}"
    textColor: "{colors.white}"
    rounded: "full"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.deep-wine}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-wine}"
    rounded: "full"
    padding: "12px 32px"
---

# Design System: Veramiek

## 1. Overview

**Creative North Star: "The Gallery Shelf"**

Veramiek presenteert handgemaakt keramiek zoals een kleine galerie dat zou doen: veel wit, één diepe kleur, en verder niets dat afleidt van het werk zelf. De site is verfijnd, minimalistisch en tijdloos, geen decoratie om de decoratie, elk element dient om het vakmanschap van Vera zichtbaarder te maken, niet om zichzelf te tonen. Dit systeem verwerpt expliciet de generieke AI/SaaS-esthetiek (gradient text, eyebrows, hero-metrics, identieke kaartgrids) én de vorige Stitch-redesign (Material Design 3-achtige surface-tokens, EB Garamond/DM Sans).

De eerste homepage-bouw (05/07/2026) bevestigde het lettertypepaar uit `_palette-preview/index.html`: Playfair Display voor titels, Gruppo voor lopende tekst, in Title Case, niet in hoofdletters. Dit vervangt de eerder voorziene Gruppo+Julius Sans One-combinatie uit de seed-versie van dit document.

**Key Characteristics:**
- Wit als drager, niet als "leeg" maar als galerieruimte
- Eén diepe merkkleur (Deep Wine) draagt vrijwel alle tekst en interactie
- Accentkleur (Pastel Groen) is bewust schaars: alleen kleine details
- Een sierlijke serif (Playfair Display) voor titels in gewone hoofd-/kleine letters (Title Case), een rustige geometrische sans (Gruppo) voor lopende tekst

## 2. Colors

Precies drie rollen, geen uitgebreid palet. Sinds de hero-herbouw (08/07/2026) is de rolverdeling omgedraaid t.o.v. de oorspronkelijke "wit draagt"-opzet: **Deep Wine draagt** (de body-achtergrond, site-breed), **wit spreekt** (tekst op het wijnrode vlak, en de schaarse witte "adempauze"-vlakken zoals panelen en formulieren), **Pastel Groen fluistert**.

### Primary
- **Deep Wine** (#2F0410): Drager van de site: standaard `body`-achtergrondkleur. Binnen witte adempauze-vlakken (panelen, cart-drawer, formulieren) is Deep Wine juist de tekst-/interactiekleur (`.bg-white` zet dit lokaal terug via `globals.css`).

### Tertiary
- **Pastel Groen** (#CBD1A1): Uiterst subtiel accent. Alleen voor kleine details: een dunne lijn onder een hero-titel of sectiekop, de footer-haarlijn. Nooit grote vlakken of achtergronden.

### Neutral
- **Wit** (#FFFFFF): Standaard tekstkleur op het wijnrode vlak, en de kleur van de bewuste "adempauze"-vlakken (secties, panelen, kaarten) die het galerie-wit contrast terugbrengen tussen de overwegend wijnrode pagina's.

### Named Rules
**The Whisper Rule.** Pastel Groen verschijnt nooit als vlak, alleen als lijn of kleine tekst. Zodra het accent groter wordt dan een paar pixels, is het te veel.

## 3. Typography

**Display Font:** Playfair Display (met serif fallback)
**Body Font:** Gruppo (met sans-serif fallback)

**Character:** Een sierlijke, klassieke serif tegenover een smalle, geometrische sans: het contrast tussen de twee draagt het rustige, galerie-achtige gevoel zonder decoratie, warmte komt van de serif-titels, precisie van de strakke lopende tekst.

### Hierarchy
- **Display** (400, Title Case, letter-spacing 0.08em, line-height 1.1): Logo-wordmark, h1, h2, h3. Draagt de titel-momenten van de site. Geen forced uppercase, Playfair Display heeft van zichzelf al genoeg karakter en contrast.
- **Body** (400, 19px/1.1875rem minimum, line-height 1.6): Lopende tekst, knoppen, navigatielinks, productbeschrijvingen. Regellengte begrenzen op 65-75ch voor leesbaarheid.

### Named Rules
**The 19px Floor Rule.** Gruppo is een dun single-weight lettertype dat onder ongeveer 19px onleesbaar wordt. Geen enkele Gruppo-tekst (labels, chips, footer, knoppen) mag kleiner worden weergegeven dan 1.1875rem; dit is structureel afgedwongen in de Tailwind `--text-*`-schaal, niet een richtlijn die per component onthouden moet worden.
**The Title Case Rule.** Titels staan in gewone hoofd-/kleinletters (Title Case) met ruime tracking (0.08em), nooit geforceerd in hoofdletters. Lopende tekst blijft altijd in kleine letters; het contrast tussen serif-titel en sans-body is het hele typografische systeem.

## 4. Elevation

Vlak systeem, geen schaduwen. Diepte ontstaat door het contrast tussen wit en Deep Wine-vlakken, niet door drop-shadows of gelaagdheid. Een galerie hangt werk tegen een muur, niet op kussens.

### Named Rules
**The Flat Gallery Rule.** Geen box-shadow op kaarten, knoppen, tegels of afbeeldingen. Scheiding tussen elementen komt van whitespace en kleurcontrast, nooit van schaduw. In de Tailwind-implementatie zijn alle `--shadow-*`-tokens structureel op "geen schaduw" gezet, zodat dit niet per component onthouden hoeft te worden.

## 5. Components

Gebouwd tijdens de eerste homepage-implementatie (05/07/2026): navigatie, hero, twee full-bleed secties, een collectiewand, een redactioneel blograster, en twee CTA-secties. Componentenbestanden staan onder `web/src/components/`.

### Navigation
- **Structuur:** Schermbrede (`fixed inset-x-0`), edge-to-edge balk zonder gecentreerde `max-w`-wrapper.
- **Top-stand (alleen homepage, nog niet gescrold):** hoogte 92px, witte achtergrond met Deep Wine tekst/logo, kleurt bij hover om naar Deep Wine achtergrond met wit logo/tekst (logo-crossfade). Gecentreerde navigatielinks (alleen zichtbaar vanaf `lg:`), cart-icoon rechts. Geen hamburger/menu-paneel in deze stand.
- **Solid-stand (na ~60px scroll op de homepage, of altijd op subpagina's zonder hero):** hoogte 56px, wit/geblurd vlak (`bg-white/90` + `backdrop-blur-md`), Deep Wine tekst en logo, dunne Pastel Groen onderrand op 40% dekking. Rechts: cart-icoon + hamburger.
- **Megamenu bestaat niet meer.** Het vroegere hover-megamenu met collectie-/categoriekolommen op desktop is vervangen: op alle breedtes opent "Collecties" nu via het hamburger-paneel.
- **Menu-paneel (voorheen alleen "Mobiel", nu de standaard voor het volledige navigatiemenu):** hamburger-icoon (twee lijnen die naar een kruis roteren) opent een wit paneel dat van rechts inschuift (`role="dialog"`, focus-trap, Escape-sluiten, body-scroll-lock). "Collecties" klapt de collectienamen uit via hover (desktop) of een aparte chevron-knop met `aria-expanded` (touch).

### Buttons (CtaButton)
- **Vorm:** volledig afgeronde pil (`rounded-full`), geen scherpe hoeken.
- **Primary:** Deep Wine vulling, witte tekst, padding 12px/32px (md) of 16px/40px (lg).
- **Outline:** transparant met Deep Wine rand en tekst, vult bij hover.
- **Light / Light Outline:** witte varianten voor gebruik op Deep Wine-vlakken of foto's.
- **Hover/Active:** opacity-verlaging bij hover, lichte `scale-[0.98]` bij active-druk. Geen enkele CTA-tekst wrapt naar een tweede regel.

### LoadIntro (homepage-only)
- **Verloop:** een gecentreerd rond wit logo op een Deep Wine vlak houdt ~1,5s stand en fadet weg, waarna een wijnrood en (overlappend) een wit paneel van onder naar boven wegtrekken (`scaleY` 1→0, `transform-origin: top`) tot aan de header en de hero onthullen.
- **Eenmalig per sessie:** speelt alleen bij het eerste bezoek van een browsersessie (`sessionStorage`-vlag, gezet na afloop van de animatie). Bij een herbezoek binnen dezelfde sessie wordt de intro direct overgeslagen en fadet de Hero-tekst meteen in plaats van na de volledige intro-duur te wachten.
- **Reduced motion:** slaat de hele animatie over en toont de hero direct.

### Hero
- **Stijl:** volledige viewport (`h-[100svh]`), fullscreen video (`hero-breda-warmrays-web.mp4`, gecomprimeerd, met poster-frame) met een donkere multiply-filter (`bg-black/30 mix-blend-multiply`) voor leesbaarheid die de kleurintensiteit van de video behoudt i.p.v. een platte zwarte scrim.
- **Wordmark:** groot, uitgerekt (`scale-y-125`) "VERAMIEK" linksonder, `font-bold`, clamp-getallen tot 18rem. Faded in na de LoadIntro-panelen (of direct bij een geskipte intro).
- **Tagline en collectierij (bewuste 19px-vloer-uitzondering):** de tagline (drie regels, 0.85rem) en de collectierij "Dune & Dust / Blush / Boeren bontjes" (1rem) onder het wordmark zijn kleiner dan de 19px-floor rule toestaat. Kenny heeft dit expliciet geaccepteerd in preview (08/07/2026); dit is de enige plek in de site waar de vloer bewust wordt doorbroken. Op mobiel (`< md:`) staat de tagline in normale flow onder het wordmark; vanaf `md:` staat hij absoluut gepositioneerd rechts van het wordmark op ooghoogte met de bovenkant.

### Collection Tile (Collecties-wand)
- **Layout:** rand-aan-rand grid met 2px naad (`gap-[2px]`), geen padding tussen tegels. Tegelgroottes variëren bewust (7/5-kolomsplit) in plaats van vier identieke vakken.
- **Label:** een licht chip (`bg-white/90`), gecentreerd onderaan de tegel (`bottom-5 left-1/2 -translate-x-1/2`), Deep Wine tekst op de naam van de collectie.
- **Hover:** subtiele beeld-zoom (`scale-[1.03]`), uitgeschakeld onder `prefers-reduced-motion`.

### Blog Tile (redactioneel raster)
- **Layout:** 12-koloms grid, elke tegel met een handmatig toegewezen `layoutClass` (kolombreedte, kolomstart, verticale `translate-y`) en eigen beeldverhouding, geen uniforme masonry.
- **Hover/Focus-interactie:** een typemachine-animatie (`useTypewriter`) onthult de excerpt teken voor teken over een Deep Wine-overlay (`bg-wine/70`) op de foto. Onder `prefers-reduced-motion` verschijnt de excerpt direct volledig, geen karakter-voor-karakter animatie.

### Footer
- **Stijl:** volle-breedte Deep Wine vlak, wit logo, één horizontale rij van nav-links + Instagram, generous verticale padding (`py-20`/`py-24`).
- **Rand:** dunne Pastel Groen haarlijn (`border-t border-sage/30`) bovenaan: de enige plek waar het accent als lijn "fluistert" in plaats van als tekst.

## 6. Do's and Don'ts

### Do:
- **Do** wit als volwaardige galerieruimte behandelen, niet als "nog in te vullen" leegte.
- **Do** Deep Wine (#2F0410) de hoofdrol geven in tekst en interactieve elementen.
- **Do** Pastel Groen (#CBD1A1) reserveren voor dunne lijnen en kleine tekstdetails.
- **Do** Playfair Display in Title Case met ruime tracking (0.08em) voor titels, Gruppo in kleine letters voor lopende tekst.
- **Do** elke Gruppo-tekst op minimaal 19px (1.1875rem) houden; dit is structureel afgedwongen in de type-schaal.
- **Do** twee heldere, ongehinderde paden aanhouden: winkelen en workshop boeken.

### Don't:
- **Don't** gradient text, eyebrows of hero-metric-templates gebruiken; leest als generieke AI/SaaS-marketing.
- **Don't** identieke kaartgrids herhalen voor producten, workshops of blogposts; varieer tegelgroottes bewust.
- **Don't** terugvallen op de vorige Stitch-look: geen Material Design 3-achtige surface/on-surface tokens, geen EB Garamond/DM Sans.
- **Don't** Pastel Groen gebruiken als achtergrondvlak of grote kleurvlek.
- **Don't** schaduwen toevoegen aan kaarten, tegels of knoppen; het systeem is bewust vlak, structureel afgedwongen via de `--shadow-*`-tokens.
- **Don't** Gruppo-tekst kleiner dan 19px weergeven; het lettertype wordt daaronder onleesbaar.
