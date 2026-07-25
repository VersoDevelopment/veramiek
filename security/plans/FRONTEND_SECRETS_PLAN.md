# Frontend Secrets Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen.

## New files

Geen.

## Verification goals

- [x] Geen geheime sleutel in enig bestand onder `web/src` of `web/public`
- [x] Alle gevoelige aanroepen lopen via de eigen backend
- [x] Enige `NEXT_PUBLIC_*`-variabele is een pad, geen sleutel

## Manual verification (for Kenny)

DevTools, tabblad Sources, zoek op `sk_`, `Bearer`, `secret` en `AKIA`. Verwacht: alleen de `Authorization: Bearer`-regel in het adminpaneel, met een token dat je zelf net hebt opgehaald.
