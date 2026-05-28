# Error Handling Fix Plan

## Changes

- `api/server.js` - Add a global Express error handler at the bottom of the file.
- `api/Dockerfile` - Set `NODE_ENV=production`.
- `api/.env.example` - Document `NODE_ENV=production`.

## Verification goals

- [x] Login errors do not distinguish password vs TOTP
- [x] Auth errors are generic
- [ ] NODE_ENV=production set in Dockerfile
- [ ] Global error handler present to prevent stack trace leaks

## Manual verification (for Kenny)

1. Cause a deliberate 500 error (e.g., temporarily break a route handler).
2. Verify the response body does NOT contain a stack trace.
3. Verify the error IS logged in Docker logs (`docker logs veramiek_api_1`).
