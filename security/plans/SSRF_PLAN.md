# SSRF Fix Plan

## Changes

- `api/server.js` - In `/send-order` handler, validate that all image URLs in submitted items start with `https://veramiek.nl/` before passing to email builder.

## Verification goals

- [x] Server never fetches user-supplied URLs
- [ ] Order email builder only includes images from `https://veramiek.nl/` domain

## Manual verification (for Kenny)

Send a test order with `items: [{ images: ["http://evil.com/x.png"] }]`. Verify the resulting email contains no external image tags (or that the image is stripped).
