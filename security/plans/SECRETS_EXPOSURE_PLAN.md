# Secrets Exposure Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen. De categorie is schoon.

## New files

Geen.

## Verification goals

- [x] `git ls-files` geeft geen `.env`, `.htpasswd` of `totp_secret.txt`
- [x] `git log --all -- "*.env"` is leeg
- [x] Grep op geheimpatronen over alle getrackte bestanden geeft geen treffers
- [x] `api/.env.example` bevat alleen placeholders
- [x] Geen `NEXT_PUBLIC_*`-variabele bevat een geheim
- [x] Live 404 op `/api/.env` en `/.git/config`

## Manual verification (for Kenny)

Draai `gitleaks detect` over de veramiek-repo als je een tweede paar ogen wilt op de git-historie.
