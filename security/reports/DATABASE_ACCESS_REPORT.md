# Database Access Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: N/A

## Findings

Veramiek heeft geen database. Alle state staat in JSON-bestanden in `api/data/`, die in productie een Docker-volume is (`api_data` in `docker-compose.yml`):

- `products.json`, `site_content.json`, `workshops.json` (publiek leesbaar via `/products`, `/content`, `/workshops`)
- `bookings.json` (bevat NAW van aanvragers, alleen via `/admin/bookings` achter JWT-auth)
- `blocked_dates.json`, `totp_secret.txt`

Geen Supabase, Firebase, RLS-policies of anon key. Geen databaseclient in `package.json`.

## What's at risk

De bestanden zijn alleen bereikbaar via de API-routes. De enige publieke route die uit `bookings.json` put is `GET /availability`, en die geeft uitsluitend `{datum: "full"|"blocked"}` terug, geen namen, e-mailadressen of telefoonnummers. Live gecontroleerd: `GET /api/availability?maand=2026-08` geeft `{"2026-08-19":"full"}`.

## What's already secure

Boekingsgegevens zitten achter de `auth`-middleware; de publieke beschikbaarheidsroute is bewust een projectie zonder persoonsgegevens.

## Recommendations

Geen. Als er ooit een database bij komt, dan geldt deze categorie opnieuw.
