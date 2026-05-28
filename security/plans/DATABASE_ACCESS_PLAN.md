# Database Access Fix Plan

## Changes

None required. No database is used.

## Verification goals

- [x] No database connection strings in source code
- [x] Data files stored in Docker named volume, not host bind mount

## Manual verification (for Kenny)

On the server, run `docker volume inspect veramiek_api_data` to confirm the volume is not accidentally bind-mounted to a world-readable path.
