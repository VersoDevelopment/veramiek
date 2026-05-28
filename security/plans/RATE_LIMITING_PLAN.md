# Rate Limiting Fix Plan

## Changes

- `api/server.js` - Add a global rate limit middleware and a per-authenticated-upload rate limit.

## Verification goals

- [x] /send-contact: 3 req/min
- [x] /send-order: 3 req/min
- [x] /admin/login: 5 req/15min
- [x] /admin/setup: 5 req/15min
- [ ] Global baseline rate limit applied to all routes
- [ ] Upload endpoint has per-IP rate limit

## Manual verification (for Kenny)

Send more than 100 requests per minute to `/api/products`. After the threshold, responses should return 429.
