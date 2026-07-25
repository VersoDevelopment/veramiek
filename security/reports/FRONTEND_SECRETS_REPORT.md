# Frontend Secrets Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Onderzocht: alles onder `web/src/` en `web/public/`, plus `api/admin.html`.

- De enige `NEXT_PUBLIC_*`-variabele is `NEXT_PUBLIC_API_BASE`. In productie is die `/api` (zie `docker-compose.yml`, build-arg op de `next`-service), dus een relatief pad en geen sleutel. Lokaal `http://localhost:3001`.
- `web/src/lib/api.ts` scheidt bewust twee basis-URL's: `NEXT_PUBLIC_API_BASE` voor de browser en `API_BASE_INTERNAL` voor server-side fetches. Die tweede heeft geen `NEXT_PUBLIC_`-prefix en lekt dus niet naar de bundle.
- Geen enkele fetch vanuit de browser gaat rechtstreeks naar een derde partij. Contact, bestelling en boeking gaan naar de eigen API, die daarna pas met Zoho SMTP praat.
- `api/admin.html` bewaart het admintoken in `sessionStorage` (`vmk_token`) en stuurt het als `Authorization: Bearer`-header mee. Het token wordt door de server uitgegeven en staat niet in de broncode.
- Geen sleutels, tokens of wachtwoorden hardcoded in enig bestand onder `web/src`.

## What's at risk

Niets. De browser kan alleen dat wat de eigen API publiek aanbiedt.

## What's already secure

SMTP-credentials, JWT-geheim en de TOTP-sleutel blijven volledig server-side. Het adminpaneel gebruikt `sessionStorage` in plaats van `localStorage`, dus het token verdwijnt bij het sluiten van het tabblad.

## Recommendations

Geen.
