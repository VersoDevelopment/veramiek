# CORS Security Report

## Status: PASS

## Findings

CORS is configured in `api/server.js`:

```javascript
app.use(cors({
  origin: ['https://veramiek.nl', 'https://admin.veramiek.nl', 'http://localhost:8082', 'http://localhost:3001'],
  credentials: true
}));
```

**Assessment:**
- Origin whitelist is explicit and minimal: production domains plus two localhost ports for development.
- No wildcard (`*`) origin.
- `credentials: true` is set, which is appropriate because the admin panel sends the JWT Bearer token.
- The `localhost` origins are acceptable for development but would only matter to an attacker with local network access (and even then, localhost is same-machine only).
- The CORS configuration is applied at the Express level. The API is only accessible through nginx (not directly from the internet), so the CORS headers are an additional defence layer.

One minor note: `credentials: true` with an explicit origin whitelist is correct usage. If origin were `*`, `credentials: true` would be blocked by browsers anyway - this is properly implemented.

## What's at risk

Nothing significant. The whitelist is tight and correct.

## What's already secure

- Explicit origin whitelist (no wildcard).
- Correct use of `credentials: true` with explicit origins.

## Recommendations

No changes required. Optionally, remove the localhost entries in production builds if a separate build pipeline is ever introduced, but this is very low priority.
