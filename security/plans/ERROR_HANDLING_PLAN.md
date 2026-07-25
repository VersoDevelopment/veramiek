# Error Handling Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen doorgevoerd. De handler stond er al en werkt.

## New files

Geen.

## Verification goals

- [x] Globale error handler vangt onafgehandelde fouten
- [x] Antwoorden aan de client bevatten alleen een generieke melding
- [x] Volledige details alleen server-side gelogd
- [x] Geen stacktrace of bestandspad in enig API-antwoord (live getest met kapotte JSON)
- [x] `NODE_ENV=production` in beide containers

## Manual verification (for Kenny)

Geen. Live getest tijdens de audit.
