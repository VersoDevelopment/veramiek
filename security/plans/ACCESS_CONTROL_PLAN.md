# Access Control Fix Plan

## Changes

None required.

## Verification goals

- [x] All admin CRUD endpoints require valid JWT
- [x] Public product endpoint filters unavailable products
- [x] No unauthenticated access to admin data

## Manual verification (for Kenny)

1. `curl https://veramiek.nl/api/admin/products` without Authorization header. Should return 401.
2. `curl https://veramiek.nl/api/admin/upload` without Authorization header. Should return 401.
3. `curl https://veramiek.nl/api/products` without token. Should return 200 with only available products.
