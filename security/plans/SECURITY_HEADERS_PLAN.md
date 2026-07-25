# Security Headers Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen. De headerset is compleet en live geverifieerd.

## New files

Geen.

## Verification goals

- [x] CSP, HSTS, X-Frame-Options, X-Content-Type-Options en Referrer-Policy op elke respons
- [x] Headers via een centrale plek (`nginx-app.conf`), herhaald per location omdat nginx niet overerft
- [x] `/api/uploads/` heeft een strengere eigen CSP (`default-src 'none'`)

## Manual verification (for Kenny)

`curl -sI https://veramiek.nl/` en `curl -sI https://veramiek.nl/api/uploads/x.png` en kijk of beide de verwachte headers teruggeven.
