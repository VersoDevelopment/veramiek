# Cors Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen.

## New files

Geen.

## Verification goals

- [x] CORS-origin is een expliciete lijst met echte domeinen
- [x] Geen wildcard
- [x] `credentials: true` alleen in combinatie met specifieke origins
- [x] Live: `Origin: https://evil.com` krijgt geen `Access-Control-Allow-Origin` terug

## Manual verification (for Kenny)

`curl -I -H "Origin: https://evil.com" https://veramiek.nl/api/products` en controleer dat `evil.com` niet wordt teruggegeven.
