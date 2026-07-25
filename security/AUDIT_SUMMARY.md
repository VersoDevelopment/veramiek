# Veramiek Security Audit Summary

**Project:** Veramiek (veramiek.nl)
**Stack:** Next.js 16 (container `veramiek-next-1`) + Express-API (`veramiek-api-1`) achter nginx (`veramiek-app-1`), via NGINX Proxy Manager
**Datum:** 25/07/2026
**Auditor:** Claude Code (vibe-check framework, 17 categorieen)
**Vorige audits:** [AUDIT_2026-05-29.md](AUDIT_2026-05-29.md) en [REAUDIT_2026-06-07.md](REAUDIT_2026-06-07.md), allebei nog op de oude statische site. Dit is de eerste volledige audit van de Next.js-versie.

---

## Resultaten

| # | Categorie | Status | Rapport | Plan |
|---|-----------|--------|---------|------|
| 1 | SECRETS_EXPOSURE | PASS | [rapport](reports/SECRETS_EXPOSURE_REPORT.md) | [plan](plans/SECRETS_EXPOSURE_PLAN.md) |
| 2 | DATABASE_ACCESS | N/A | [rapport](reports/DATABASE_ACCESS_REPORT.md) | [plan](plans/DATABASE_ACCESS_PLAN.md) |
| 3 | AUTH_MIDDLEWARE | MEDIUM (gefixt) | [rapport](reports/AUTH_MIDDLEWARE_REPORT.md) | [plan](plans/AUTH_MIDDLEWARE_PLAN.md) |
| 4 | ACCESS_CONTROL | PASS | [rapport](reports/ACCESS_CONTROL_REPORT.md) | [plan](plans/ACCESS_CONTROL_PLAN.md) |
| 5 | FRONTEND_SECRETS | PASS | [rapport](reports/FRONTEND_SECRETS_REPORT.md) | [plan](plans/FRONTEND_SECRETS_PLAN.md) |
| 6 | SSRF | PASS | [rapport](reports/SSRF_REPORT.md) | [plan](plans/SSRF_PLAN.md) |
| 7 | CSRF | PASS | [rapport](reports/CSRF_REPORT.md) | [plan](plans/CSRF_PLAN.md) |
| 8 | SECURITY_HEADERS | PASS | [rapport](reports/SECURITY_HEADERS_REPORT.md) | [plan](plans/SECURITY_HEADERS_PLAN.md) |
| 9 | CORS | PASS | [rapport](reports/CORS_REPORT.md) | [plan](plans/CORS_PLAN.md) |
| 10 | RATE_LIMITING | PASS | [rapport](reports/RATE_LIMITING_REPORT.md) | [plan](plans/RATE_LIMITING_PLAN.md) |
| 11 | SQL_INJECTION | N/A | [rapport](reports/SQL_INJECTION_REPORT.md) | [plan](plans/SQL_INJECTION_PLAN.md) |
| 12 | XSS | MEDIUM (gefixt) | [rapport](reports/XSS_REPORT.md) | [plan](plans/XSS_PLAN.md) |
| 13 | PAYMENT_WEBHOOKS | N/A | [rapport](reports/PAYMENT_WEBHOOKS_REPORT.md) | [plan](plans/PAYMENT_WEBHOOKS_PLAN.md) |
| 14 | FILE_UPLOADS | MEDIUM (gefixt) | [rapport](reports/FILE_UPLOADS_REPORT.md) | [plan](plans/FILE_UPLOADS_PLAN.md) |
| 15 | ERROR_HANDLING | PASS | [rapport](reports/ERROR_HANDLING_REPORT.md) | [plan](plans/ERROR_HANDLING_PLAN.md) |
| 16 | PASSWORD_HASHING | PASS | [rapport](reports/PASSWORD_HASHING_REPORT.md) | [plan](plans/PASSWORD_HASHING_PLAN.md) |
| 17 | DEPENDENCIES | HIGH (gefixt) | [rapport](reports/DEPENDENCIES_REPORT.md) | [plan](plans/DEPENDENCIES_PLAN.md) |

**Restrisico na de fixes: LOW. Geen kritieke bevindingen.**

---

## Kritieke bevindingen

Geen.

---

## Wat er gefixt is

### HIGH: kwetsbare dependencies (categorie 17)

- `nodemailer` 8.0.9 had een HIGH-advisory (de `raw`-optie omzeilt `disableFileAccess`/`disableUrlAccess`). Naar 9.0.3.
- `sharp` 0.34.5 in Next had vier libvips-CVE's. Dit is geen build-only pakket: Next gebruikt het op de server voor `next/image`. Vastgezet op 0.35.3 via `overrides`, want Next 16.2.11 brengt het zelf nog niet mee.
- `postcss` 8.4.31 had XSS en path traversal. Vastgezet op 8.5.23 via `overrides`.

Beide `npm audit`-runs staan nu op 0 kwetsbaarheden, en `npm run build` slaagt met de nieuwe sharp.

### MEDIUM: 2FA was met alleen het wachtwoord te omzeilen (categorie 3)

`POST /admin/setup` gaf de TOTP-sleutel terug op alleen het adminwachtwoord. Wie dat wachtwoord had, kon de sleutel ophalen, in zijn eigen authenticator zetten en gewoon inloggen. De tweede factor voegde in dat scenario niets toe.

Nu geldt: is 2FA al ingesteld, dan is naast het wachtwoord ook een geldige huidige code nodig. Een verse installatie kan de eerste QR nog wel gewoon ophalen.

### MEDIUM: JSON-LD niet geescaped (categorie 12)

`web/src/app/collecties/[id]/page.tsx` zette `JSON.stringify(productJsonLd)` rechtstreeks in een `<script>`-blok. `JSON.stringify` escapet `<` en `>` niet, dus een productnaam met `</script>` erin sloot het blok en de rest belandde als HTML in de pagina. Alleen door een ingelogde beheerder te vullen, maar het resultaat is opgeslagen XSS op een publieke pagina.

Nieuwe helper `web/src/lib/jsonLd.ts` escapet `&`, `<`, `>`, U+2028 en U+2029. Beide JSON-LD-blokken gebruiken hem nu.

### MEDIUM: uploads namen hun extensie uit de bestandsnaam (categorie 14)

Een bestand met `Content-Type: image/png` maar de naam `payload.html` belandde als `.html` op schijf en werd als `text/html` uitgeserveerd op veramiek.nl. De inhoud werd nergens gecontroleerd, alleen de door de client opgegeven mimetype.

Nu: extensie uit een vaste tabel van vier toegestane types, en na het wegschrijven een magic-byte-controle op de eerste 12 bytes. Klopt die niet, dan gaat het bestand meteen weg en volgt een 400.

Dat de schade beperkt bleef, komt doordat `nginx-app.conf` op `/api/uploads/` al `Content-Security-Policy: default-src 'none'` plus `nosniff` zette. Dat was goed gedaan.

---

## Openstaande punten

| Punt | Categorie | Prioriteit | Toelichting |
|---|---|---|---|
| Uploads op een apart (sub)domein of bucket | 14 | laag | Isoleert geuploade bestanden van de origin van de site. Winst boven op de bestaande CSP is klein. |
| `esc()` in `api/admin.html` ook `'` laten escapen | 12 | laag | Zelf-XSS door een beheerder met een apostrof in een productnaam. Een regel werk. |
| `app.disable('x-powered-by')` in de API | 15 | laag | De API verraadt nu dat het Express is. Informatie-hygiene. |
| `script-src 'unsafe-inline'` uit de CSP | 8 | laag | Vraagt een nonce-gebaseerde CSP via Next-middleware en kost cachebaarheid. Niet aan te raden zolang de site geen bezoekersinhoud toont. |
| localhost-origins alleen buiten productie in de CORS-lijst | 9 | laag | Netter, lost geen concreet risico op. |

---

## Handmatige checks voor Kenny

Na het uitrollen:

1. **2FA-setup.** Open `https://veramiek.nl/api/admin/setup`, vul alleen het wachtwoord in. Verwacht: "2FA is al ingesteld. Vul ook je huidige verificatiecode in." Met wachtwoord plus code hoort de QR gewoon te verschijnen.
2. **Upload.** Upload via het adminpaneel een gewone JPG en controleer dat de foto verschijnt. Hernoem daarna een tekstbestand naar `test.jpg` en probeer dat te uploaden. Verwacht: "Bestand is geen geldige afbeelding".
3. **Productfoto's.** Open een productpagina met een geuploade foto. Dat is de enige plek waar sharp 0.35 aan het werk gaat.
4. **Contactformulier.** Stuur een testbericht. Dat toetst nodemailer 9.
5. **XSS-test.** Vul `<script>alert('XSS')</script>` in als naam in het contactformulier en kijk in de ontvangen mail of dat als tekst getoond wordt.

---

## Historie

| Datum | Wat | Uitkomst |
|---|---|---|
| 29/05/2026 | Eerste audit, oude statische site | 1 HIGH (nodemailer), 6 MEDIUM, allemaal gefixt |
| 07/06/2026 | Re-audit na het redesign | LOW restrisico, geen nieuwe bevindingen |
| 25/07/2026 | Eerste audit van de Next.js-versie | 1 HIGH en 3 MEDIUM gevonden en gefixt, restrisico LOW |
