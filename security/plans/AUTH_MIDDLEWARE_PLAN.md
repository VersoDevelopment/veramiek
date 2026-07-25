# Auth Middleware Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

- `api/server.js` (regel 144-167) - vlag `totpEnrolled` toegevoegd: waar zodra de sleutel uit `.env` of uit een bestaand `totp_secret.txt` komt, onwaar bij een verse installatie die de sleutel nu pas aanmaakt.
- `api/server.js` (`POST /admin/setup`) - geeft de sleutel alleen nog terug als 2FA nog niet is ingesteld, of als er naast het wachtwoord een geldige huidige TOTP-code wordt meegestuurd.
- `api/server.js` (`GET /admin/setup`) - extra invoerveld voor de huidige code plus uitleg; de `setup()`-functie in de pagina stuurt `totp` mee.

## New files

Geen.

## Verification goals

- [x] Elke route die klantdata teruggeeft of wijzigt heeft `auth` als eerste middleware
- [x] Onbevoegde verzoeken naar `/api/admin/*` geven 401 (live getest op products, bookings, blocked-dates, content)
- [x] `POST /admin/setup` weigert met alleen een wachtwoord zodra 2FA is ingesteld
- [x] Een verse installatie kan nog steeds zonder code de eerste QR ophalen
- [x] `node --check api/server.js` slaagt

## Manual verification (for Kenny)

Na het uitrollen: open `https://veramiek.nl/api/admin/setup`, vul alleen het wachtwoord in en klik op "QR-code ophalen". Verwacht: "2FA is al ingesteld. Vul ook je huidige verificatiecode in." Vul daarna wachtwoord plus de code uit je app in, dan hoort de QR gewoon te verschijnen.
