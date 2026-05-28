# CSRF (Cross-Site Request Forgery) Security Report

## Status: PASS

## Findings

CSRF protection is evaluated for the API endpoints.

**Admin endpoints** are protected by JWT Bearer token authentication. CSRF attacks require the victim's browser to send a forged request - Bearer tokens in the Authorization header cannot be set by cross-origin forms or `<img>` tags. The JWT is stored in `sessionStorage` (not cookies), so it is never automatically sent by the browser. This makes admin endpoints immune to CSRF.

**Public endpoints** (`/send-contact`, `/send-order`):
- These accept `Content-Type: application/json` requests.
- The CORS configuration restricts origins to `['https://veramiek.nl', 'https://admin.veramiek.nl', 'http://localhost:8082', 'http://localhost:3001']` with `credentials: true`.
- Simple cross-origin form POST (with `application/x-www-form-urlencoded`) would be blocked because the API expects JSON and the CORS preflight would reject unexpected origins.
- The contact form has a honeypot field (`website`) as a basic bot deterrent.

The public form endpoints do not require authentication and do not perform privileged actions (they only send emails), so CSRF on them would at most send a spam email to info@veramiek.nl - not a meaningful attack.

## What's at risk

Very low. The worst case CSRF on public endpoints is someone sending a contact form message on behalf of another user's email address - which is also achievable by just filling in the form directly.

## What's already secure

- JWT Bearer token (not cookie) for admin routes eliminates CSRF risk on admin actions.
- CORS restricted to known origins.
- JSON content-type requirement blocks simple form-based CSRF.

## Recommendations

No action required.
