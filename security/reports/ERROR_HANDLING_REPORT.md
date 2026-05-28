# Error Handling Security Report

## Status: LOW

## Findings

Error handling is reviewed for information leakage that could help attackers.

**Server-side:**

Most error responses return generic messages:
- Auth failures: `'Niet ingelogd'`, `'Sessie verlopen, log opnieuw in'`
- Login failure: `'Onjuist wachtwoord of verificatiecode'` (deliberately does not distinguish password from TOTP)
- Email failures: `'Mail mislukt'`
- Validation errors: specific and intentional (e.g., `'Naam is verplicht'`, `'Ongeldig e-mailadres'`)

**Issues:**

1. **LOW: Unhandled rejection on JSON parse errors in startup.** The startup code catches JSON parse errors with empty catches:
   ```javascript
   try { products = JSON.parse(fs.readFileSync(PRODUCTS_F, 'utf8')); } catch (_) {}
   ```
   If `products.json` is corrupted, the products array silently stays empty. No alert is logged. This is not a security issue but could cause silent data loss.

2. **LOW: Internal error details in multer errors.** When multer rejects a file (wrong type, too large), the error message from `cb(new Error(...))` is caught by Express and returned. The current messages are safe and user-friendly.

3. **LOW: `console.error(err)` on email failures and QR generation.** Full error objects are logged to stdout. On the server, this goes to Docker logs. If Docker logs are accessible to multiple people this leaks SMTP error details. For a single-admin setup this is acceptable.

4. **INFO: No global Express error handler.** If an unhandled error occurs in a route handler, Express's default error handler will respond with the error message and stack trace in development mode. In production (`NODE_ENV=production`), Express suppresses the stack trace. The Dockerfile does not set `NODE_ENV=production`.

## What's at risk

- Without `NODE_ENV=production`, unhandled errors might leak stack traces to clients.
- Silent JSON parse failures at startup could cause data loss without alerting the admin.

## What's already secure

- Login error messages do not distinguish password vs TOTP failure.
- Auth errors are generic.
- Email error messages are generic to clients.

## Recommendations

1. Add `NODE_ENV=production` to the `.env.example` and set it in the Dockerfile or compose.
2. Add a global Express error handler to catch and log unhandled errors without exposing stack traces.
