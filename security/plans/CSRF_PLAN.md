# Csrf Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen.

## New files

Geen.

## Verification goals

- [x] Geen sessiecookie in gebruik
- [x] Auth via `Authorization`-header, niet via cookie
- [x] Body parsing accepteert alleen `application/json`
- [x] Een cross-origin formulier-POST naar een schrijfroute levert 400, niet een verwerkte actie

## Manual verification (for Kenny)

Geen.
