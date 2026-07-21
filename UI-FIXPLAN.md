# UI-fixplan Veramiek web (voor Sonnet)

Uitvoeringsplan op basis van de UI-audit van 09/07/2026 (score 14/20). Werk de taken in volgorde af: eerst blok A (P1), dan blok B (P2), dan blok C (P3). Elke taak heeft een eigen commit.

## Context, eerst lezen

- Projectmap: `Websites/veramiek/web` (Next.js App Router, Tailwind v4, Motion).
- **Let op:** dit is een nieuwere Next.js dan je trainingsdata. Lees bij twijfel de vendored docs in `Websites/veramiek/web/node_modules/next/dist/docs/` (zo is `priority` op `next/image` deprecated ten gunste van `preload`).
- Designsysteem: `Websites/veramiek/DESIGN.md`. Harde regels die je NIET mag breken:
  - **19px Floor Rule**: geen Gruppo-tekst onder 1.1875rem (bestaande, door Kenny geaccepteerde uitzonderingen in de Hero laat je staan).
  - **Whisper Rule**: sage (#CBD1A1) alleen als dunne lijn of klein tekstdetail, nooit als vlak.
  - **Flat Gallery Rule**: nergens box-shadow.
  - Precies 3 kleurrollen: wine (#2F0410), wit, sage.
- Copy-regel: nooit em-dashes of gedachtestreepjes in tekst.
- Testen: `npm run dev` in `Websites/veramiek/web`, controleer op 390px én desktopbreedte. Draai aan het eind `npm run build` om te verifiëren dat er geen build-fouten zijn.
- NIET doen: het hero-ontwerp wijzigen (wordmark, video-keuze, layout is goedgekeurd), niets deployen, geen content herschrijven, DESIGN.md alleen aanpassen waar taak C1 dat zegt.

---

## Blok A (P1)

### A1. Hero-video verkleinen + poster + opruimen
`src/components/sections/Hero.tsx` gebruikt `/videos/hero-breda-warmrays.mp4` (29MB, `preload="auto"`).

1. Comprimeer met ffmpeg naar een nieuw bestand (bron niet overschrijven):
   `ffmpeg -i public/videos/hero-breda-warmrays.mp4 -vf "scale=-2:1080" -c:v libx264 -crf 28 -preset slow -movflags +faststart -an public/videos/hero-breda-warmrays-web.mp4`
   Doel: onder ~5MB. Lukt dat niet met crf 28, probeer crf 30 of 720p. Controleer visueel dat het beeld acceptabel blijft.
2. Genereer een poster-frame: `ffmpeg -i public/videos/hero-breda-warmrays-web.mp4 -vf "select=eq(n\,0)" -frames:v 1 public/videos/hero-poster.jpg` en zet `poster="/videos/hero-poster.jpg"` op de `<video>`. Zet `preload` op `"metadata"`.
3. Verwijs in Hero.tsx naar het nieuwe bestand.
4. Verwijder de ongebruikte video's uit `public/videos/`: `hero.mp4`, `hero-bg.mp4`, `hero-breda.mp4`, `hero-small.mp4` en de originele `hero-breda-warmrays.mp4` (staat in git-historie als hij ooit terug moet; check eerst met `git log --oneline -- <pad>` dat hij gecommit is geweest, zo niet: vraag Kenny).

### A2. Hero-tagline op mobiel
In `src/components/sections/Hero.tsx` staat de tagline `absolute top-0 left-full ml-6 whitespace-nowrap` naast het VERAMIEK-wordmark; de sectie heeft `overflow-hidden`. Op smalle schermen valt hij daardoor (deels) buiten beeld.

1. Verifieer eerst op 390px (dev server + devtools of headless screenshot).
2. Fix: op mobiel (onder `md:`) de tagline uit de absolute positie halen en onder het wordmark plaatsen (boven de collectierij), vanaf `md:` de huidige positionering behouden. Geen andere hero-wijzigingen.

### A3. Focus-management dialogen
1. `src/components/cart/CartDrawer.tsx`: heeft al `role="dialog"` + `aria-modal` + Escape. Voeg toe: (a) focus verplaatsen naar het paneel (of de sluitknop) bij openen en terug naar het triggerelement bij sluiten; (b) focus-trap binnen het paneel (Tab/Shift+Tab cyclen); (c) body-scroll-lock zolang open (zelfde patroon als MobileNav: `document.body.style.overflow`).
2. `src/components/layout/MobileNav.tsx`: voeg toe aan het paneel: `role="dialog"` + `aria-modal="true"` + `aria-label="Menu"`, Escape-sluiten, dezelfde focus-verplaatsing en focus-trap als bij de drawer.
3. Bouw hiervoor één kleine gedeelde hook (bijv. `src/lib/useDialogFocus.ts`) in plaats van twee keer dezelfde logica. Geen externe dependency toevoegen.

### A4. LoadIntro alleen bij eerste bezoek per sessie
`src/components/sections/LoadIntro.tsx`: check bij mount `sessionStorage.getItem("veramiek-intro")`; als gezet, direct `phase = "done"`. Zet de key na afloop (of meteen bij starten). SSR-safe houden (sessionStorage alleen in effect/client aanraken, geen hydration mismatch: start in een neutrale fase en beslis in een effect). Let op: `INTRO_TOTAL_MS` wordt door Hero.tsx gebruikt voor de tekst-fade-delay; zorg dat de hero-tekst bij een geskipte intro direct fadet (geen 3s wachten). Maak daarvoor de delay-logica in Hero.tsx afhankelijk van dezelfde sessionStorage-check (kleine gedeelde helper is prima).

## Blok B (P2)

### B1. CollectionTile autoplay respecteert reduced motion
`src/components/ui/CollectionTile.tsx`: gebruik `usePrefersReducedMotion()` en start de `setInterval` niet wanneer die true is (nu wordt alleen de crossfade-transition uitgezet, het wisselen gaat door; WCAG 2.2.2).

### B2. Touch targets + cart-badge
1. `QtyStepper` in `src/components/cart/CartDrawer.tsx`: vergroot de plus/min-knoppen naar minimaal 44×44px tap-oppervlak (padding vergroten, iconen mogen 16px blijven). Check dat de stepper er in de drawer, op /winkelwagen en op de productpagina nog goed uitziet.
2. `src/components/cart/CartButton.tsx`: badge is 0.7rem Gruppo (onder de 19px-vloer en onleesbaar klein). Maak het bolletje groter met tekst op minimaal `text-xs` (= 19px in dit project) of los het anders op zonder de vloer te breken (bijv. iets groter bolletje dat deels over het icoon valt). Het moet subtiel blijven.

### B3. Contrast "Foto volgt"-placeholder
`src/components/ui/ProductTile.tsx` en `src/components/ui/ProductGallery.tsx`: `opacity-40` op wit-op-wine haalt ~3.6:1. Verhoog naar minimaal `opacity-70` (≈8:1).

### B4. Kalender-grid-semantiek
`src/components/sections/BookingCalendar.tsx`: `role="grid"` staat nu op de weekdag-kopregel zonder row/gridcell-structuur en de echte dagen-grid heeft geen rol. Simpelste correcte oplossing: verwijder `role="grid"` en `aria-label` van de kopregel-div en zet `role="group"` + `aria-label="Beschikbare datums"` op de dagen-grid-div. De bestaande per-dag aria-labels en roving focus blijven ongewijzigd.

### B5. Naamchips niet laten overlopen
`src/components/ui/CollectionTile.tsx` en `src/components/ui/ProductTile.tsx`: de chips hebben `whitespace-nowrap` en lopen bij lange namen de tegel uit. Vervang door `max-w-[calc(100%-2rem)] truncate` (nowrap mag weg). Test met een lange dummynaam.

### B6. Mobiele nav: subcollecties op touch
`src/components/layout/MobileNav.tsx`: subcollecties openen alleen op `onMouseEnter`. Voeg een expliciete toggle toe: maak van het "Collecties"-item een rij met de link plus een aparte chevron-knop (`aria-expanded`, `aria-label="Collecties uitklappen"`) die `collectionsOpen` toggelt. Hover-gedrag mag blijven bestaan naast de knop.

### B7. Dead code verwijderen
`src/components/ui/CtaButton.tsx`: verwijder de ongebruikte variant `sageFillOnWine` (type, entry in `variantClasses` en het speciale render-pad). Hij wordt nergens gebruikt en zou wit-op-sage (≈1.9:1) opleveren.

## Blok C (P3)

### C1. DESIGN.md synchroniseren met de werkelijkheid
`Websites/veramiek/DESIGN.md` beschrijft de oude situatie. Werk bij (documenteren wat IS, geen nieuwe designbeslissingen):
- Kleursysteem: body is nu wine-dominant (wine = drager, wit = adempauze-vlakken), zie `src/app/globals.css`.
- Nav: huidige twee standen (witte topbalk met gecentreerde links op de homepage-top; solid wit/blur met logo + cart + hamburger na scroll en op subpagina's). Het megamenu bestaat niet meer op desktop-top; de hamburger met paneel is de standaard.
- Hero: video-hero met groot VERAMIEK-wordmark, tagline en collectierij; documenteer de door Kenny geaccepteerde uitzonderingen op de 19px-vloer (tagline en collectierij) expliciet als uitzondering.
- LoadIntro beschrijven (inclusief once-per-session gedrag uit A4).
- Frontmatter-typografie klopt niet meer helemaal (er staat deels oude info): display = Playfair Display, body = Gruppo.

### C2. Shopfilters naar de URL syncen
`src/components/sections/ShopFilter.tsx`: schrijf bij filterklik de state naar de querystring (`soort`, `collectie`) via `router.replace` met `scroll: false`, zodat filters deelbaar zijn en de terugknop klopt. Lees de vendored Next-docs over `useRouter`/`useSearchParams` voordat je dit bouwt.

### C3. Skip-link
`src/app/layout.tsx`: voeg als eerste element in de body een skip-link naar `#main` toe (visueel verborgen, zichtbaar bij focus, stijl passend bij het focus-ring-systeem in globals.css) en geef `<main>` het id.

### C4. Deprecated `priority` prop
`src/components/sections/LoadIntro.tsx`: vervang `priority` door `preload` op de `next/image` (Nav.tsx gebruikt al `preload`).

---

## Afronding

1. `npm run build` moet slagen; loop daarna de site door op 390px en desktop (home, /collecties, productpagina, /workshops, /winkelwagen, /contact, mobiel menu, cart-drawer, toetsenbord-navigatie door drawer en kalender).
2. Commit per taak (of per blok als taken klein zijn), duidelijke NL-commitmessages, en push naar github.com/VersoDevelopment/veramiek.
3. Voeg een entry toe bovenaan `WORKLOG.md` in de repo-root ("Claude projecten"): wat gedaan, wat open blijft.
4. Niet deployen.
