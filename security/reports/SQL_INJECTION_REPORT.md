# Sql Injection Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: N/A

## Findings

Geen SQL in het project. Geen database-driver, ORM of querybuilder in `api/package.json`. Alle opslag gaat via `fs.readFileSync`/`fs.writeFileSync` op JSON-bestanden.

Wel gecontroleerd op de verwante risico's van bestandsgebaseerde opslag:

- Geen enkel pad wordt uit gebruikersinvoer opgebouwd. De vijf databestanden zijn constanten bovenaan `server.js`, samengesteld met `path.join(__dirname, ...)` op vaste namen.
- Uploadnamen worden volledig door de server bepaald (tijdstempel plus 6 willekeurige bytes plus een extensie uit een vaste tabel), dus geen path traversal via `originalname`.
- `JSON.parse` op de databestanden staat in `try/catch`, dus een corrupt bestand laat de API niet crashen.

## What's at risk

Niets binnen deze categorie.

## What's already secure

Vaste bestandspaden, servergestuurde bestandsnamen, en foutafhandeling rond het inlezen.

## Recommendations

Geen. Komt er ooit een database, dan geldt deze categorie opnieuw.
