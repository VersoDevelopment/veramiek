# Secrets Exposure Fix Plan

## Changes

- `api/.dockerignore` (new file) - prevent `.env` from being copied into Docker image builds

## New files

- `api/.dockerignore`

## Verification goals

- [x] `api/.env` is in `.gitignore`
- [x] No secrets are hardcoded in any source file
- [x] `docker-compose.yml` uses `env_file` directive, not inline values
- [ ] `api/.dockerignore` exists and includes `.env` and `data/`

## Manual verification (for Kenny)

Run: `git log --all --full-history -- "api/.env"` on the server repo. If any commits appear, rotate all secrets immediately (SMTP password, JWT_SECRET, ADMIN_PASSWORD).
