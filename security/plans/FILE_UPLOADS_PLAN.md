# File Uploads Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

- `api/server.js` - `UPLOAD_TYPES`: vaste tabel van vier toegestane mimetypes (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) naar een vaste extensie. `fileFilter` weigert alles daarbuiten, dus SVG blijft geweigerd en de weigering is nu een allowlist in plaats van twee losse controles.
- `api/server.js` - `filename` gebruikt `UPLOAD_TYPES[file.mimetype]` en raakt `file.originalname` niet meer aan.
- `api/server.js` - `MAGIC_BYTES` plus `hasValidMagicBytes()`: leest de eerste 12 bytes en toetst die aan de handtekening van het formaat. WEBP krijgt de dubbele controle (`RIFF` op 0 en `WEBP` op 8).
- `api/server.js` - `POST /admin/upload` roept die controle aan na het wegschrijven (multer streamt naar schijf, dus in `fileFilter` zijn de bytes er nog niet), verwijdert het bestand bij een mismatch en geeft 400.
- `api/server.js` - `limits.files: 1`, zodat er per verzoek maar een bestand binnenkomt.

## New files

Geen.

## Verification goals

- [x] Bestandstype gevalideerd op magic bytes, niet op extensie of aangeleverde mimetype
- [x] Bestandsnaam volledig servergestuurd (tijdstempel plus willekeurige bytes plus extensie uit de tabel)
- [x] Groottelimiet server-side afgedwongen (10 MB in multer, 12 MB in nginx)
- [x] Unittest: echte PNG geaccepteerd, HTML met `.png`-extensie geweigerd, echte WEBP geaccepteerd, RIFF/WAVE als `.webp` geweigerd
- [x] `node --check api/server.js` slaagt
- [ ] Uploads op een apart domein of bucket (bewust niet gedaan, zie aanbeveling 3)

## Manual verification (for Kenny)

Na het uitrollen: upload via het adminpaneel een gewone JPG en controleer dat de foto normaal verschijnt. Probeer daarna een tekstbestand dat je hernoemt naar `test.jpg` te uploaden; verwacht "Bestand is geen geldige afbeelding".
