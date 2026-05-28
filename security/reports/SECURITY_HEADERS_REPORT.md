# Security Headers Security Report

## Status: MEDIUM

## Findings

Security headers are set in `nginx.conf`:

**Present:**
- `X-Frame-Options: SAMEORIGIN` - prevents clickjacking
- `X-Content-Type-Options: nosniff` - prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - limits referrer leakage

**Missing:**
1. **Content-Security-Policy (CSP)** - HIGH impact when absent. The frontend loads scripts from Google Fonts and has inline `<script>` blocks. Without CSP, any XSS vulnerability would have unrestricted access. A strict CSP would significantly reduce XSS blast radius.

2. **Permissions-Policy** (formerly Feature-Policy) - LOW impact. Restricts browser features like camera, microphone, geolocation. Not critical for this site.

3. **Strict-Transport-Security (HSTS)** - MEDIUM impact. HSTS ensures the browser always uses HTTPS and prevents SSL stripping attacks. This is likely handled by the Nginx Proxy Manager (NPM) layer above, but should be verified.

4. **Cache-Control on API proxy responses** is set correctly (`no-cache, no-store, must-revalidate` in the `/api/` proxy block).

**Note on the API server (Express):** The Express app does not set any security headers itself. It runs behind nginx, so this is acceptable as long as nginx sets the headers. However, the nginx headers are only set for the `web` container. The API container (`port 3001`) is only exposed internally via Docker network and nginx proxy - it is not directly accessible from the internet. This is correct architecture.

## What's at risk

- Without CSP, any injected JavaScript (via XSS) runs with full page permissions.
- Without HSTS, a network attacker could perform SSL stripping on first visit (if not handled by NPM).

## What's already secure

- X-Frame-Options prevents clickjacking.
- X-Content-Type-Options prevents drive-by downloads via MIME confusion.
- API is behind nginx, not directly internet-exposed.

## Recommendations

1. Add `Content-Security-Policy` header to nginx.conf.
2. Add `Strict-Transport-Security` to nginx.conf (if not already set by NPM).
3. Add `Permissions-Policy` header (low priority).
