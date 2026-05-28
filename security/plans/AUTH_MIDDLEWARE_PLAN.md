# Auth Middleware Fix Plan

## Changes

- `api/server.js` - Replace custom `loginAttempts` Map with `express-rate-limit` on the login route; add periodic cleanup for Map if keeping it as fallback.

## Verification goals

- [x] JWT used with 8h expiry
- [x] All admin routes protected by `auth` middleware
- [x] TOTP required at login
- [x] bcrypt cost factor >= 10
- [ ] Login rate limiting uses `express-rate-limit` (survives restarts better than in-memory Map)
- [ ] No unbounded in-memory growth from scan attempts

## Manual verification (for Kenny)

1. Attempt to log in with wrong password 6 times. Verify the 6th attempt returns 429.
2. Restart the API container and try again immediately. With the fix, the counter persists (or resets to 0 and you get 5 more attempts before lockout). Note: without a persistent store restarts will reset counters regardless of which library is used, but using express-rate-limit at least standardises the approach.
3. Log in successfully and verify the JWT in sessionStorage disappears when the tab is closed.
