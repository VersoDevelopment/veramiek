# CORS Fix Plan

## Changes

None required.

## Verification goals

- [x] No wildcard origin in CORS config
- [x] credentials: true only used with explicit origin whitelist
- [x] Origin list is minimal (production + localhost only)

## Manual verification (for Kenny)

Run: `curl -H "Origin: https://evil.com" -I https://veramiek.nl/api/products`
The response should NOT include `Access-Control-Allow-Origin: https://evil.com`.
