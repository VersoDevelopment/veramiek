# File Uploads Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: MEDIUM (gefixt)

## Findings

Een uploadroute: `POST /admin/upload`, achter `auth` en `uploadLimit` (20 per minuut), met multer naar `api/uploads/` (Docker-volume `api_uploads`). Bestanden worden daarna geserveerd via `GET /uploads/*`, publiek bereikbaar als `https://veramiek.nl/api/uploads/<naam>`.

**Bevinding (MEDIUM): de extensie kwam uit de bestandsnaam van de uploader.**

```js
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  cb(null, Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext);
}
```

Een bestand met `Content-Type: image/png` maar de naam `payload.html` kwam dus als `<tijdstempel>-<hex>.html` op schijf en werd door `express.static` met `Content-Type: text/html` uitgeserveerd op het eigen domein. Daarnaast controleerde `fileFilter` alleen `file.mimetype`, en die waarde kiest de client zelf; de inhoud van het bestand werd nergens getoetst.

Twee dingen beperkten de schade al: de route zit achter admin-auth, en `nginx-app.conf` zet op `/api/uploads/` een eigen `Content-Security-Policy: default-src 'none'` plus `X-Content-Type-Options: nosniff`. Live bevestigd. Die CSP blokkeert script-uitvoering in een geserveerd HTML-bestand. Het was dus geen open deur, maar wel een gat in de eerste laag.

Wat wel al goed stond: 10 MB limiet server-side (plus `client_max_body_size 12m` in nginx), willekeurige bestandsnaam zonder enige relatie tot de originele naam, en SVG expliciet geweigerd omdat dat formaat script kan bevatten.

## What's at risk

Voor de fix: een beheerdersaccount (of iemand die een adminsessie kaapt) kon een bestand met willekeurige extensie op het eigen domein plaatsen. Zonder de CSP op die map was dat opgeslagen XSS op veramiek.nl geweest.

## What's already secure

Auth, rate limit, groottelimiet, willekeurige bestandsnamen, SVG geweigerd, aparte strenge CSP en `nosniff` op de uploadmap, en `Cache-Control: public, max-age=2592000` (veilig omdat namen uniek zijn).

## Recommendations

1. Extensie afleiden uit een vaste tabel per toegestane mimetype in plaats van uit de aangeleverde naam. Gedaan.
2. Na het wegschrijven de eerste bytes toetsen aan de handtekening van het formaat. Gedaan.
3. Openstaand: uploads op een apart (sub)domein of bucket. Dat isoleert ze van de origin van de site en is de enige echte volgende stap. Vraagt een aparte host plus aanpassing van `remotePatterns` in `next.config.ts`; nu niet gedaan omdat de winst boven op de bestaande CSP klein is.
