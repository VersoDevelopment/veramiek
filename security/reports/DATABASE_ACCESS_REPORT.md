# Database Access Security Report

## Status: N/A

## Findings

This project uses no relational or NoSQL database. Persistence is handled via two JSON flat-files:

- `api/data/products.json` - product catalogue
- `api/data/site_content.json` - editable website text

Both files live inside a named Docker volume (`api_data`) that is not bind-mounted to the host filesystem in production. Data is loaded into memory at startup and written synchronously via `fs.writeFileSync`.

No database connection strings, ORM, query builder, or raw SQL are present anywhere in the codebase.

## What's at risk

- If the Docker volume were misconfigured and mounted world-readable, the JSON files (containing product data and site content) would be readable. Neither file contains PII beyond what is already public.
- There is no database to inject into, no credentials to steal.

## What's already secure

- No database used; no connection string to protect.
- Docker volume is named, not bind-mounted.

## Recommendations

No action required for this category.
