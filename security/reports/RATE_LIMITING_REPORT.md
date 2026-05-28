# Rate Limiting Security Report

## Status: MEDIUM

## Findings

Rate limiting is applied via `express-rate-limit` for several endpoints:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /send-contact` | 3 requests | 60 seconds |
| `POST /send-order` | 3 requests | 60 seconds |
| `GET+POST /admin/setup` | 5 requests | 15 minutes |
| `POST /admin/login` | 5 requests | 15 minutes (fixed, see AUTH report) |

`app.set('trust proxy', 1)` is configured, which allows `express-rate-limit` to read the real client IP from `X-Forwarded-For` (set by nginx). This is correct for a reverse-proxy setup.

**Issues:**

1. **MEDIUM: No rate limit on `GET /products` or `GET /content`.** These endpoints read from memory and respond quickly, but an aggressive scraper or DDoS could still cause issues. Low risk for this scale of site, but worth noting.

2. **MEDIUM: Rate limits are in-memory (not distributed).** If multiple API container replicas were running, each would have its own counter. Currently only one replica runs (single Docker container), so this is not an active problem.

3. **LOW: `POST /admin/upload` has no explicit rate limit beyond authentication.** A logged-in admin could upload many large files quickly. The 10MB file size limit per upload is set, which mitigates this somewhat, but there is no per-session upload frequency limit.

4. **LOW: No global rate limit middleware.** A general `rateLimit({ windowMs: 60_000, max: 100 })` applied to all routes would provide a baseline defence against scanning/scraping.

## What's at risk

- Contact and order forms are protected against spam/flood (3/min is appropriate).
- Login is rate-limited (5 attempts / 15 min).
- Public content endpoints could be scraped or used in a minor DDoS, but impact is low (static memory reads).

## What's already secure

- Contact and order form rate limits prevent email spam abuse.
- Login rate limit prevents brute force.
- Trust proxy is correctly set.

## Recommendations

1. Add a global rate limit (e.g., 200 requests/min per IP) as a baseline.
2. Consider adding a rate limit to `POST /admin/upload` even for authenticated users.
