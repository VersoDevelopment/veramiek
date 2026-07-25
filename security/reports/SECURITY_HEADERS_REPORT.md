# Security Headers Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Headers komen uit `nginx-app.conf`, de container die voor de Next-app en de API zit. Live gemeten op `https://veramiek.nl/`:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'; font-src 'self' data:;
  img-src 'self' data: blob: https://veramiek.nl https://www.veramiek.nl;
  media-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self';
  frame-ancestors 'none'; object-src 'none'
```

Alle vijf gevraagde headers zijn aanwezig, plus `Permissions-Policy`. De CSP is compleet: `form-action`, `base-uri`, `frame-ancestors` en `object-src` zitten erin, wat verder gaat dan het minimum.

De config herhaalt het headerblok bewust in elk `location`-blok dat eigen headers zet, omdat nginx `add_header` niet overerft zodra een blok er zelf een definieert. Dat is correct opgelost en staat toegelicht in de config.

`/api/uploads/` krijgt een strengere eigen CSP: `default-src 'none'; frame-ancestors 'none'` plus `nosniff`. Live bevestigd. Dat is precies wat je wilt op een map met door mensen aangeleverde bestanden.

## What's at risk

`script-src 'unsafe-inline'` blijft de grootste rest. Next zet zijn opstart- en paginadata inline in de HTML, dus zonder `'unsafe-inline'` breekt de app. Concreet risico is klein, want er wordt nergens door bezoekers aangeleverde HTML gerenderd (zie XSS-rapport), maar het betekent wel dat de CSP geen tweede verdedigingslinie vormt als er ooit toch een injectiepunt bijkomt.

## What's already secure

Volledige headerset op elk pad, strengere CSP op de uploadmap, HSTS met `includeSubDomains`, en `frame-ancestors 'none'` zodat de site nergens in een frame past.

## Recommendations

Optioneel en niet triviaal: Next ondersteunt een nonce-gebaseerde CSP via middleware. Dat vraagt dynamische rendering op pagina's die nu statisch zijn en kost dus cachebaarheid. Gezien het lage restrisico niet aan te raden zolang de site geen door bezoekers aangeleverde inhoud toont.
