# Veramiek Security Audit Summary

**Project:** Veramiek (veramiek.nl)
**Stack:** Static HTML/JS frontend + Node.js/Express API in Docker, served via nginx + NPM proxy
**Date:** 2026-05-29
**Auditor:** Claude Code

---

## Results Table

| # | Category | Status | Fixed |
|---|----------|--------|-------|
| 1 | SECRETS_EXPOSURE | PASS | - |
| 2 | DATABASE_ACCESS | N/A | - |
| 3 | AUTH_MIDDLEWARE | MEDIUM | Yes |
| 4 | ACCESS_CONTROL | PASS | - |
| 5 | FRONTEND_SECRETS | PASS | - |
| 6 | SSRF | LOW | Yes |
| 7 | CSRF | PASS | - |
| 8 | SECURITY_HEADERS | MEDIUM | Yes |
| 9 | CORS | PASS | - |
| 10 | RATE_LIMITING | MEDIUM | Yes |
| 11 | SQL_INJECTION | N/A | - |
| 12 | XSS | MEDIUM | Yes |
| 13 | PAYMENT_WEBHOOKS | N/A | - |
| 14 | FILE_UPLOADS | MEDIUM | Yes |
| 15 | ERROR_HANDLING | LOW | Yes |
| 16 | PASSWORD_HASHING | PASS | - |
| 17 | DEPENDENCIES | HIGH (fixed) | Yes |

**Overall status after fixes: LOW**

---

## Critical Issues

None found.

---

## High Issues (fixed)

### nodemailer SMTP injection vulnerabilities (DEPENDENCIES)

nodemailer 6.9.9 had four CVEs including SMTP command injection and unintended email delivery.
Fixed by upgrading to nodemailer 8.0.9. `npm audit` now reports 0 vulnerabilities.

---

## Medium Issues (fixed)

### 1. Missing security headers (SECURITY_HEADERS)

`nginx.conf` was missing Content-Security-Policy, Strict-Transport-Security, and Permissions-Policy.

Fixed: Added all three headers to `nginx.conf`. CSP allows self + inline scripts (required for the single-file HTML approach) + Google Fonts.

### 2. XSS via innerHTML with API data (XSS)

Product names, descriptions, and badges from the API were inserted directly into innerHTML without escaping in `index.html`. A compromised admin account could store XSS payloads in product fields.

Fixed: Added `esc()` function to `index.html` and applied it to all product fields, cart item names, and quantity button onclick attributes (using `JSON.stringify` for safe event handler injection).

### 3. In-memory login rate limiter (AUTH_MIDDLEWARE)

The custom `loginAttempts` Map reset on process restart, allowing rate limit bypass during redeploys.

Fixed: Replaced with `express-rate-limit` (same library used for all other rate limits) applied directly to the `/admin/login` route.

### 4. No global rate limit and no upload rate limit (RATE_LIMITING)

No baseline rate limit protected public read endpoints. No per-IP limit on the admin upload endpoint.

Fixed: Added `globalLimit` (200 req/min) applied to all routes, and `uploadLimit` (20 uploads/min) applied to `POST /admin/upload`.

### 5. SVG upload allowed (FILE_UPLOADS)

SVG files pass the `image/*` MIME check but can contain active JavaScript.

Fixed: Added explicit SVG rejection in the multer `fileFilter`.

---

## Low Issues (fixed)

### 6. External image tracking in order emails (SSRF)

Client-submitted image URLs in orders were passed through to email HTML. An attacker could inject an external tracking pixel URL that Vera's email client would load.

Fixed: `imgUrl()` now only passes through URLs starting with `https://veramiek.nl/`. All other external URLs return `null` and are omitted from emails.

### 7. No NODE_ENV=production, no global error handler (ERROR_HANDLING)

Express could leak stack traces on unhandled errors without `NODE_ENV=production`.

Fixed: Added `NODE_ENV=production` to the Dockerfile and `.env.example`. Added a global Express error handler.

---

## Files Changed

| File | Change |
|------|--------|
| `api/server.js` | Login rate limit, global rate limit, upload rate limit, SVG rejection, imgUrl domain restriction, global error handler |
| `api/Dockerfile` | Added `ENV NODE_ENV=production` |
| `api/.env.example` | Added `NODE_ENV=production` |
| `api/package.json` | nodemailer upgraded to ^8.0.9 |
| `api/package-lock.json` | Updated by npm install |
| `api/.dockerignore` | New file: prevents .env and data/ from entering Docker image |
| `nginx.conf` | Added CSP, HSTS, Permissions-Policy headers |
| `index.html` | Added `esc()` function, applied to all product/cart innerHTML renders |

---

## Remaining Recommendations (not auto-fixable)

1. Run `git log --all --full-history -- "api/.env"` on the server repo to confirm `.env` was never committed.
2. Verify HSTS is not set twice (nginx.conf now sets it; check if NPM also sets it to avoid duplicate headers).
3. Test the contact form and order flow end-to-end after deploying the nodemailer upgrade.
4. Check https://securityheaders.com/?q=veramiek.nl after deploying nginx.conf changes.
5. If a payment provider (Mollie/Stripe) is added in the future, implement webhook HMAC signature verification before going live.
