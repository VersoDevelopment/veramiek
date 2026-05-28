# Dependencies Fix Plan

## Changes

- `api/package.json` - Updated `nodemailer` from `^6.9.9` to `^8.0.9`
- `api/package-lock.json` - Updated automatically by npm install

## Verification goals

- [x] `npm audit` reports 0 vulnerabilities
- [x] nodemailer >= 8.0.5 installed
- [x] API still functions (createTransport, sendMail verified)

## Manual verification (for Kenny)

After deploying:
1. `docker exec veramiek_api_1 node -e "console.log(require('./node_modules/nodemailer/package.json').version)"` should print `8.0.9` or higher.
2. Send a test contact form message and verify the confirmation email arrives.
3. Run `npm audit` in the api directory on the server.
