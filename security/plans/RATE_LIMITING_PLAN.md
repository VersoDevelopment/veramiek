# Rate Limiting Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen.

## New files

Geen.

## Verification goals

- [x] Login heeft rate limiting (5 per 15 min)
- [x] Limiet slaat toe na N mislukte pogingen: live 429 vanaf de 5e
- [x] Niet te omzeilen door `X-Forwarded-For` te vervalsen
- [x] Gelimiteerde verzoeken geven 429

## Manual verification (for Kenny)

Geen. Live getest tijdens de audit.
