# Secrets Exposure Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Onderzocht: `.gitignore` (root, `api/`, `web/`), alle getrackte bestanden, git-historie, env-gebruik in code, `NEXT_PUBLIC_*`-variabelen.

Aanwezige geheimen en waar ze staan:

| Geheim | Locatie | Getrackt in git |
|---|---|---|
| `SMTP_USER`, `SMTP_PASS` | `api/.env` | nee (`api/.gitignore:1`) |
| `ADMIN_PASSWORD`, `JWT_SECRET` | `api/.env` | nee |
| TOTP-sleutel | `api/data/totp_secret.txt` (Docker-volume) | nee (`api/.gitignore:4`) |
| Staging-wachtwoord | `.htpasswd` (alleen op de server) | nee (`.gitignore:16`) |

Controles:

- `git ls-files` over de hele repo: geen `.env`, geen `.htpasswd`, geen `totp_secret.txt`, geen `node_modules`.
- `git log --all -- "*.env"`: leeg, dus ook nooit gecommit geweest en later verwijderd.
- Grep over alle getrackte bestanden op `sk_live_`, `sk_test_`, `AKIA`, `BEGIN (RSA|OPENSSH|PRIVATE)`, `password =`, `secret =`, `api_key =` en `Bearer <token>`: geen treffers buiten de security-documentatie zelf.
- `api/.env.example` bevat alleen omschrijvingen (`kies_een_sterk_wachtwoord`, `vervang_dit_door_random_string...`), geen echte waarden.
- `web/.env.local` bevat alleen `NEXT_PUBLIC_API_BASE=http://localhost:3001`, een dev-URL en geen sleutel.
- Live: `GET /api/.env` en `GET /.git/config` geven allebei 404.

De server dwingt af dat de geheimen er zijn: zonder `ADMIN_PASSWORD` of `JWT_SECRET` stopt `server.js` bij het opstarten (`api/server.js:169-177`). Dat voorkomt dat de API stilletjes met een leeg JWT-geheim draait.

## What's at risk

Niets gevonden. Zou `api/.env` alsnog in git belanden, dan lekt in een klap het SMTP-wachtwoord (mail versturen namens info@veramiek.nl), het adminwachtwoord en het JWT-geheim (waarmee een aanvaller zelf geldige admintokens kan ondertekenen zonder 2FA te passeren).

## What's already secure

Gescheiden `.gitignore` per deelmap, `.env.example` met placeholders, runtime-data in Docker-volumes buiten de repo, en een startcontrole op de verplichte variabelen.

## Recommendations

Geen. Bij een volgende sleutelrotatie: `JWT_SECRET` vernieuwen maakt alle bestaande adminsessies ongeldig, dat is bedoeld gedrag.
