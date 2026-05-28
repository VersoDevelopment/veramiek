# Payment Webhooks Fix Plan

## Changes

None required. No payment processing present.

## Verification goals

- [x] No payment provider credentials in source
- [x] No webhook endpoints to secure

## Manual verification (for Kenny)

N/A. If Mollie or Stripe is added later, return to this category and implement HMAC signature verification on the webhook endpoint.
