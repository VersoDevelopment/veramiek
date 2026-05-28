# Frontend Secrets Fix Plan

## Changes

None required.

## Verification goals

- [x] No API keys or tokens in index.html
- [x] No API keys or tokens in admin.html
- [x] JWT stored in sessionStorage, not localStorage

## Manual verification (for Kenny)

Open browser DevTools on veramiek.nl and admin.veramiek.nl. Check Application > Storage > Local Storage. Verify no sensitive tokens or keys are stored there.
