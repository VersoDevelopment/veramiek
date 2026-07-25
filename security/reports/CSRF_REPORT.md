# Csrf Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Er zijn geen sessiecookies. Authenticatie loopt volledig via een JWT dat het adminpaneel in `sessionStorage` bewaart en handmatig als `Authorization: Bearer`-header meestuurt (`api/admin.html:685`). Een browser stuurt zo'n header niet automatisch mee bij een cross-site verzoek, dus het klassieke CSRF-scenario bestaat hier niet.

De publieke schrijfroutes (`/send-contact`, `/send-order`, `/book`) zijn wel via POST te bereiken, maar:

- `express.json()` verwerkt alleen `Content-Type: application/json`. Een cross-origin HTML-formulier kan alleen `application/x-www-form-urlencoded`, `multipart/form-data` of `text/plain` sturen, en dan blijft `req.body` leeg en volgt een 400.
- Een `fetch` met JSON-content-type is een preflighted verzoek en loopt tegen de CORS-allowlist aan.
- Er valt met deze routes ook niets te bereiken wat een aanvaller niet rechtstreeks kan: ze versturen alleen mail, en dat is al beperkt tot 3 per minuut plus een honeypot.

`/admin/upload` gebruikt `multipart/form-data`, wat een formulier wel kan sturen, maar de route zit achter `auth` en dat token gaat niet vanzelf mee.

## What's at risk

Niets. Geen ambient credentials, dus geen CSRF-oppervlak.

## What's already secure

Tokenauthenticatie in plaats van cookies, JSON-only body parsing, en een CORS-allowlist met vier vaste origins.

## Recommendations

Als er ooit cookie-authenticatie bijkomt: `SameSite=Lax` plus `HttpOnly` plus `Secure`, en dan opnieuw naar deze categorie kijken.
