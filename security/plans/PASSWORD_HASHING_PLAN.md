# Password Hashing Fix Plan

## Changes

None required.

## Verification goals

- [x] bcrypt used for password hashing
- [x] Cost factor >= 10 (currently 12)
- [x] No plaintext passwords stored anywhere
- [x] Timing-safe comparison used

## Manual verification (for Kenny)

Run `docker exec veramiek_api_1 node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.getRounds(process.env.ADMIN_PASSWORD))"` - this will error (getRounds on plaintext). Instead verify that the startup log does not print the ADMIN_PASSWORD value.
