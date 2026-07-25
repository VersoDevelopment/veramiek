# Ssrf Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Drie plekken waar een URL uit data een verzoek kan veroorzaken:

1. **`imgUrl()` in `api/server.js`** (bestelmails). Laat alleen `https://veramiek.nl/` door; alles wat met `http` begint maar niet met dat prefix wordt `null`, en relatieve paden worden per segment ge-encodeerd en onder `https://veramiek.nl/` gehangen. Externe URL's komen dus nooit in een mail terecht, wat ook tracking via mailclients uitsluit.
2. **`next/image`**. `web/next.config.ts` beperkt `remotePatterns` tot `veramiek.nl/api/uploads/**`, `www.veramiek.nl/api/uploads/**`, `api.veramiek.nl/uploads/**` en de host uit `NEXT_PUBLIC_API_BASE`. Next weigert elke andere host, dus de optimizer is niet als proxy naar interne adressen te gebruiken.
3. **Product-`images[]`**. `POST/PUT /admin/products` filtert op `u.startsWith('http')`, wat op zich ruim is, maar de waarden worden alleen door `next/image` (met bovenstaande allowlist) en door `imgUrl()` (veramiek.nl-only) gebruikt. Bovendien is deze route admin-only.

Geen linkpreviews, geen webhook-testknop, geen URL-validator die iets ophaalt.

## What's at risk

Geen bekende route waarlangs een bezoeker de server een verzoek naar een adres naar keuze laat doen.

## What's already secure

Beide plekken waar een URL tot een verzoek leidt hebben een allowlist op host, niet een blocklist op IP-reeksen. Dat is de strengere variant en dekt daarmee ook `127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` en DNS-rebinding.

## Recommendations

Optioneel: het filter `u.startsWith('http')` in de productroutes kan strakker (`https://veramiek.nl/api/uploads/`), zodat de opgeslagen data zelf al klopt in plaats van pas bij het renderen. Lage prioriteit, want beide consumenten filteren al.
