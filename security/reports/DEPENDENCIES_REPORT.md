# Dependencies Security Report

## Status: HIGH (fixed)

## Findings

`npm audit` was run against `api/package.json`.

**Before fix: 1 HIGH severity vulnerability**

| Package | Severity | Issue |
|---------|----------|-------|
| nodemailer <= 8.0.4 | HIGH | SMTP command injection via CRLF in transport name (EHLO/HELO); unintended domain delivery; addressparser DoS via recursive calls |

CVEs:
- GHSA-vvjj-xcjg-gr5g: SMTP CRLF injection
- GHSA-c7w3-x93f-qmm8: SMTP command injection via envelope.size
- GHSA-mm7p-fcc7-pg87: Email to unintended domain
- GHSA-rcmh-qjqh-p98v: DoS via addressparser recursion

**After fix:**
- nodemailer updated from `^6.9.9` to `^8.0.9`
- `npm audit` now reports 0 vulnerabilities
- API compatibility verified: `createTransport` and `sendMail` work identically in v8

**All other dependencies** are at non-vulnerable versions as of the audit date:
- bcryptjs 2.4.3 - no known CVEs
- cors 2.8.5 - no known CVEs
- express 4.18.x - no known CVEs
- express-rate-limit 7.5.x - no known CVEs
- jsonwebtoken 9.0.x - no known CVEs (v9 fixed critical JWT algorithm confusion from v8)
- multer 1.4.5-lts.1 - no known CVEs
- otplib 12.0.x - no known CVEs
- qrcode 1.5.x - no known CVEs

## What's at risk

Before the fix: a crafted SMTP transport name or envelope size could inject commands into the SMTP session, potentially sending emails to unintended recipients or causing service disruption.

## What's already secure

- jsonwebtoken v9 is used (v8 had critical JWT algorithm confusion vulnerabilities).
- All other packages are current and vulnerability-free.

## Recommendations

Run `npm audit` regularly (at minimum before each deployment). Consider adding a CI step that fails on high/critical vulnerabilities.
