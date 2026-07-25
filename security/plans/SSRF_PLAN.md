# Ssrf Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

Geen wijziging doorgevoerd; de allowlists staan al op de plekken waar het uitmaakt.

## New files

Geen.

## Verification goals

- [x] Enige URL-ophalende code heeft een host-allowlist
- [x] `next/image` `remotePatterns` staat alleen veramiek-hosts toe
- [x] `imgUrl()` geeft `null` op externe URL's
- [x] Geen endpoint dat een door de bezoeker aangeleverde URL ophaalt

## Manual verification (for Kenny)

Geen.
