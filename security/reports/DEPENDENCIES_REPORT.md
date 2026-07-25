# Dependencies Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: HIGH (gefixt)

## Findings

**`api/` voor de fix:**

| Pakket | Versie | Advisory |
|---|---|---|
| nodemailer | 8.0.9 | HIGH: `raw`-optie omzeilt `disableFileAccess`/`disableUrlAccess`, wat willekeurig bestand lezen en SSRF in het afgeleverde bericht mogelijk maakt (GHSA-p6gq-j5cr-w38f) |
| body-parser | <1.20.6 | LOW: DoS wanneer een ongeldige `limit` de groottecontrole stilzwijgend uitschakelt |

De nodemailer-advisory raakt code die de `raw`-optie gebruikt. Veramiek doet dat nergens, dus praktisch was de exploiteerbaarheid nul. Dat is geen reden om op een gemarkeerde versie te blijven zitten: bij de volgende audit wil je niet opnieuw hoeven uitzoeken of dit "wel of niet erg" is.

**`web/` voor de fix (Next 16.2.10):**

| Pakket | Versie | Advisory |
|---|---|---|
| sharp | 0.34.5 | HIGH: geerfde libvips-kwetsbaarheden (CVE-2026-33327, -33328, -35590, -35591) |
| postcss | 8.4.31 | HIGH: XSS via niet-geescapete `</style>` in de stringify-uitvoer, plus path traversal en bestandslek via `sourceMappingURL` |
| brace-expansion | <=5.0.7 | HIGH, alleen dev (eslint-keten): DoS via exponentiele expansie |

sharp is hier geen dev-dependency: Next gebruikt het op de server voor `next/image`-optimalisatie, dus het draait op productiedata. De remote patterns beperken dat tot `veramiek.nl/api/uploads/**`, en sinds de FILE_UPLOADS-fix zijn dat gegarandeerd echte afbeeldingen, maar dat is een beperking van de invoer en geen fix van de bibliotheek.

`npm audit fix --force` stelde voor om naar `next@9.3.3` te gaan, een downgrade van zeven hoofdversies. Dat is geen oplossing. Next 16.2.11 is de nieuwste stabiele en pint `postcss: 8.4.31` exact en `sharp: ^0.34.5` als optionele dependency, dus een gewone versiebump lost het niet op.

**Legitimiteitscontrole.** Alle directe dependencies van beide package.json's zijn bekende pakketten met jarenlange historie op npm: express, cors, jsonwebtoken, bcryptjs, multer, nodemailer, otplib, qrcode, express-rate-limit, next, react, react-dom, motion, lucide-react, tailwindcss, typescript, eslint. Geen typosquats, geen pakket met een verdacht lage downloadhistorie of een publicatiedatum van gisteren.

**Lockfiles.** `api/package-lock.json` en `web/package-lock.json` staan allebei in git.

## What's at risk

Voor de fix: de sharp-CVE's zijn de meest concrete, want die code verwerkt op de server binnenkomende afbeeldingsdata. Een kwaadaardig geprepareerde afbeelding die door de optimizer gaat kan libvips laten crashen of erger. Dat vraagt wel dat zo'n bestand eerst als productfoto geupload wordt, en dat is admin-only.

## What's already secure

Kleine, goed gekozen dependencysets. De API heeft er negen, de frontend vijf runtime-pakketten. Weinig oppervlak om te onderhouden.

## Recommendations

1. nodemailer naar 9.x. Gedaan.
2. Next naar 16.2.11 en sharp/postcss vastzetten via `overrides`. Gedaan.
3. `npm audit` bij elke sessie waarin je aan een van beide projecten werkt, niet alleen bij een audit.
