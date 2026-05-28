# CSRF Fix Plan

## Changes

None required.

## Verification goals

- [x] Admin routes use JWT Bearer (not cookie), immune to CSRF
- [x] JWT stored in sessionStorage, not cookies
- [x] CORS restricted to known origins

## Manual verification (for Kenny)

1. Open browser console on a different domain (e.g., about:blank).
2. Try: `fetch('https://veramiek.nl/api/admin/products', { headers: { Authorization: 'Bearer fake' } })`. Should get 401.
3. A cross-origin POST with a form (not JSON) to `/send-contact` should be blocked by CORS preflight.
