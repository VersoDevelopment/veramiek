# Dependencies Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

- `api/package.json` - nodemailer van `^8.0.9` naar `^9.0.3`, plus `npm audit fix` voor body-parser.
- `web/package.json` - next en eslint-config-next van `16.2.10` naar `16.2.11`.
- `web/package.json` - `overrides` toegevoegd voor `sharp: ^0.35.3`, `postcss: ^8.5.17` en `brace-expansion: ^5.0.8`, omdat Next die versies zelf vastpint en er nog geen release is die ze meebrengt.
- Beide lockfiles bijgewerkt.

## New files

Geen.

## Verification goals

- [x] `npm audit` in `api/`: 0 kwetsbaarheden
- [x] `npm audit` in `web/`: 0 kwetsbaarheden
- [x] `npm ls sharp postcss` in `web/` toont sharp 0.35.3 en postcss 8.5.23
- [x] `npm run build` in `web/` slaagt met de nieuwe sharp (alle 16 pagina's gegenereerd)
- [x] `npx tsc --noEmit` slaagt
- [x] Elke directe dependency is een bekend pakket met normale historie
- [x] Lockfiles staan in git

## Manual verification (for Kenny)

Na het uitrollen: open een productpagina met een geuploade foto en controleer dat de afbeelding laadt. Dat is de enige plek waar sharp 0.35 daadwerkelijk aan het werk gaat. Stuur ook een testbericht via het contactformulier, dat toetst nodemailer 9.
