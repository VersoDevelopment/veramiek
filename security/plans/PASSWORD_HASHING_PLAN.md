# Password Hashing Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen.

## New files

Geen.

## Verification goals

- [x] Wachtwoord gehasht met bcrypt (cost 12)
- [x] Geen MD5, SHA-1 of SHA-256 op wachtwoorden
- [x] Vergelijking via `bcrypt.compareSync`, niet via `===`

## Manual verification (for Kenny)

Geen.
