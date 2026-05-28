# Auth Middleware Security Report

## Status: MEDIUM

## Findings

Authentication is implemented in `api/server.js` and covers the admin panel. Key observations:

**Positive:**
- JWT-based authentication with `jsonwebtoken ^9.0.2` (secure, maintained version).
- Tokens expire after 8 hours (`expiresIn: '8h'`).
- All admin endpoints (`/admin/products`, `/admin/upload`, `/admin/content`) are protected by the `auth` middleware.
- 2FA (TOTP via `otplib`) is required at login alongside password.
- Login rate-limiting: max 5 attempts per 15 minutes per IP. Successful login clears the counter.
- bcrypt with cost factor 12 for password hashing.

**Issues found:**

1. **MEDIUM: In-memory rate limit store for login** (`loginAttempts` Map). When the Node.js process restarts (container redeploy, crash), all rate-limit counters reset. An attacker can bypass the lockout by causing a restart or waiting for a natural redeploy. The `/admin/setup` endpoint uses `express-rate-limit` (process-level, same weakness) but that endpoint is less critical.

2. **LOW: `loginAttempts` Map grows unboundedly.** Entries are only pruned within the check itself (when the key is looked up). IPs that attempted once and never came back stay in memory forever. Under a distributed scan this could accumulate many entries.

3. **LOW: The `auth` middleware catches all JWT errors with a single message.** This is fine for security (not leaking error type), but it means an expired token gives the same response as a tampered one, making debugging slightly harder for the admin.

4. **LOW: Token stored in `sessionStorage` (admin.html).** sessionStorage is cleared when the tab closes, which is good hygiene. However it is accessible to any JavaScript running on the same origin. Since the admin panel runs on a separate origin (`admin.veramiek.nl` via NPM), this risk is low.

5. **INFO: No token revocation.** If a JWT is stolen, it remains valid for up to 8 hours. There is no refresh-token mechanism or server-side token invalidation list. Acceptable given the 8h expiry and single-admin use case.

## What's at risk

- If the in-memory rate limiter resets during an attack window, a brute-force of the admin password becomes feasible. However the 6-digit TOTP code changes every 30 seconds, making a full login brute-force extremely difficult even without rate limiting.
- The TOTP requirement is the primary defence against brute-force.

## What's already secure

- TOTP (2FA) requirement on every login.
- JWT with 8h expiry.
- All admin routes protected.
- bcrypt cost 12.

## Recommendations

1. Replace the in-memory `loginAttempts` Map with `express-rate-limit` on the `/admin/login` route (consistent approach, and express-rate-limit can be backed by a persistent store if needed).
2. Add periodic cleanup to the `loginAttempts` Map to prevent unbounded growth (or simply switch to express-rate-limit).
