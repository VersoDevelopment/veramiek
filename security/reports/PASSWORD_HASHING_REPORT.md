# Password Hashing Security Report

## Status: PASS

## Findings

Password handling is reviewed in `api/server.js`:

```javascript
const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
```

- `bcryptjs ^2.4.3` is used for hashing.
- Cost factor is **12**, which is above the commonly recommended minimum of 10. This provides good brute-force resistance.
- The hash is computed at server startup from the environment variable. The plaintext password is never stored or logged.
- Password comparison uses `bcrypt.compareSync()` which is timing-safe (bcrypt implementations include a constant-time comparison step).
- The TOTP secret stored in `api/data/totp_secret.txt` is a random base32 string, not a password, and is stored plaintext - this is standard and correct for TOTP seeds.

**Notes:**
- There are no user accounts or user passwords to manage. The single admin password is the only credential.
- No password reset flow exists, which means if the admin password is lost, it must be changed directly in the `.env` file and the container restarted.

## What's at risk

Nothing. bcrypt with cost 12 is appropriate and correctly implemented.

## What's already secure

- bcrypt cost factor 12.
- Hash computed from env var at startup.
- No plaintext passwords stored.
- Timing-safe comparison.

## Recommendations

No changes required.
