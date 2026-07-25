# Cors Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

`api/server.js:184-187`:

```js
app.use(cors({
  origin: ['https://veramiek.nl', 'https://www.veramiek.nl', 'https://admin.veramiek.nl',
           'http://localhost:8082', 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
```

Expliciete allowlist, geen wildcard, geen reflectie van de `Origin`-header. Live getest met `Origin: https://evil.com` op `/api/products`: er komt geen `Access-Control-Allow-Origin` terug, dus de browser blokkeert het antwoord.

In de praktijk staat de API achter dezelfde nginx als de site (`/api/` op hetzelfde domein), dus alle echte verkeer is same-origin en raakt CORS niet eens.

Wel opgemerkt: het antwoord bevat `Access-Control-Allow-Credentials: true` ook wanneer de origin niet in de lijst staat. Zonder `Access-Control-Allow-Origin` heeft die header geen effect; de browser laat het antwoord toch niet door. Cosmetisch, geen kwetsbaarheid.

De drie `localhost`-origins zijn ontwikkelwaarden. Ze staan ook in productie in de lijst, maar een aanvaller heeft er niets aan: hij zou de gebruiker een pagina op diens eigen `localhost:3000` moeten laten bezoeken, en dan heeft hij al code op de machine draaien.

## What's at risk

Niets. Geen wildcard, geen reflectie.

## What's already secure

Vaste allowlist plus een same-origin opzet waardoor CORS voor normale bezoekers helemaal niet in beeld komt.

## Recommendations

Optioneel: de `localhost`-origins alleen toevoegen als `NODE_ENV !== 'production'`, zoals de Verso-API doet. Netter, maar het lost geen concreet risico op.
