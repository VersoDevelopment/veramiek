# Security Headers Fix Plan

## Changes

- `nginx.conf` - Add Content-Security-Policy, Strict-Transport-Security, and Permissions-Policy headers.

## Verification goals

- [x] X-Frame-Options: SAMEORIGIN present
- [x] X-Content-Type-Options: nosniff present
- [x] Referrer-Policy present
- [ ] Content-Security-Policy header present
- [ ] Strict-Transport-Security present (may already be set by NPM)
- [ ] Permissions-Policy present

## Manual verification (for Kenny)

Run: `curl -I https://veramiek.nl` and check for all six headers.
Also check: https://securityheaders.com/?q=veramiek.nl&followRedirects=on
