# Auth Middleware Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: MEDIUM (gefixt)

## Findings

Volledige routelijst van `api/server.js`, met of er auth voor staat:

| Route | Auth | Toelichting |
|---|---|---|
| `GET /` | nee | adminpaneel-HTML (inlogscherm), bevat zelf geen data |
| `GET /admin` | nee | redirect naar `/` |
| `GET /admin/setup` | nee | HTML-formulier, geen data |
| `POST /admin/setup` | wachtwoord (+ nu TOTP) | zie bevinding hieronder |
| `POST /admin/login` | wachtwoord + TOTP | `loginLimit` 5 per 15 min |
| `GET /products` | nee | publiek, alleen `available !== false` |
| `GET /content` | nee | publiek, redactionele teksten |
| `GET /workshops` | nee | publiek |
| `GET /availability` | nee | publiek, alleen datum plus status |
| `POST /send-contact` | nee | publiek formulier, honeypot plus 3 per min |
| `POST /send-order` | nee | publiek formulier, 3 per min |
| `POST /book` | nee | publiek formulier, honeypot plus 3 per min |
| `GET/POST/PUT/DELETE /admin/products*` | `auth` | JWT |
| `PUT /admin/content` | `auth` | JWT |
| `POST /admin/upload` | `auth` | JWT |
| `GET/POST/PUT/DELETE /admin/workshops*` | `auth` | JWT |
| `GET/PUT/DELETE /admin/bookings*` | `auth` | JWT |
| `GET/POST/DELETE /admin/blocked-dates*` | `auth` | JWT |
| `GET /uploads/*` | nee | bewust publiek, foto's staan op de site |

De `auth`-middleware (`api/server.js:239-249`) staat als eerste argument bij elke `/admin/*`-dataroute en draait dus voor de handler. Live geverifieerd: `/api/admin/products`, `/api/admin/bookings`, `/api/admin/blocked-dates` en `PUT /api/admin/content` geven zonder token allemaal 401.

**Bevinding (MEDIUM): `POST /admin/setup` leverde de TOTP-sleutel op alleen het wachtwoord.**

```js
app.post('/admin/setup', setupLimit, async (req, res) => {
  const { password } = req.body || {};
  if (!password || !bcrypt.compareSync(password, adminHash)) {
    return res.status(401).json({ error: 'Onjuist wachtwoord' });
  }
  const otpauth = authenticator.keyuri('admin', 'Veramiek Beheer', totpSecret);
  const qr = await QRCode.toDataURL(otpauth);
  res.json({ qr, secret: totpSecret });   // <- geheim, zonder tweede factor
});
```

Daarmee is de tweede factor geen tweede factor meer: wie het adminwachtwoord te pakken krijgt (hergebruik, phishing, keylogger), haalt hier de sleutel op, zet die in zijn eigen authenticator-app en logt daarna gewoon in. De 2FA voegt in dat scenario niets toe.

## What's at risk

Met een gelekt adminwachtwoord: volledige controle over producten, prijzen, workshops, teksten en boekingen (inclusief NAW van iedereen die ooit een workshop aanvroeg), plus uploadrechten op het domein.

## What's already secure

Login vraagt wachtwoord plus TOTP en is beperkt tot 5 pogingen per 15 minuten. Tokens zijn JWT's met 8 uur geldigheid. Elke dataroute onder `/admin/` heeft `auth` als eerste middleware.

## Recommendations

1. Zodra 2FA is ingesteld, de sleutel niet meer teruggeven zonder een geldige huidige code. Gedaan.
2. Het adminwachtwoord staat als platte tekst in `api/.env` (nodig, want het wordt bij het starten gehasht). Zorg dat het uniek is en nergens anders hergebruikt.
