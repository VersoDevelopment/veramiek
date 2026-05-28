# Access Control Security Report

## Status: PASS

## Findings

All mutation endpoints require a valid JWT from the `auth` middleware:

- `GET /admin/products` - protected
- `POST /admin/products` - protected
- `PUT /admin/products/:id` - protected
- `DELETE /admin/products/:id` - protected
- `PUT /admin/content` - protected
- `POST /admin/upload` - protected

Public endpoints that should be public:
- `GET /products` - returns only `available !== false` products (correctly filtered)
- `GET /content` - returns site text (no sensitive data)
- `POST /send-contact` - rate-limited (3/min)
- `POST /send-order` - rate-limited (3/min)

The nginx config does not expose any sensitive file paths. The `uploads/` directory is served as static files - this is intentional (product images need to be publicly accessible).

The admin setup route (`GET /admin/setup` and `POST /admin/setup`) requires the admin password to return the TOTP QR code, so it is not freely accessible.

No horizontal privilege escalation is possible: there is only one admin role and no user accounts.

## What's at risk

Nothing significant. Access control is well-structured for a single-admin system.

## What's already secure

- Every write/read admin operation is JWT-protected.
- Public product endpoint correctly filters out unavailable products.
- No privilege levels to confuse (single admin, no user accounts).

## Recommendations

No changes required.
