# Error Handling Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

**API.** `api/server.js` sluit af met een globale error handler:

```js
app.use((err, req, res, next) => {
  console.error('[Error]', err.message, err.stack);
  if (err.name === 'MulterError' || ...) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: 'Er is een interne fout opgetreden' });
});
```

De volledige fout gaat naar het containerlog, de client krijgt een vaste zin. Alleen multer-fouten (bestandstype, grootte) geven hun eigen melding terug, en dat zijn teksten die de server zelf schrijft, geen interne details.

Live getest met ongeldige JSON op `POST /api/send-contact`: `{"error":"Er is een interne fout opgetreden"}`. Geen stacktrace, geen bestandspad, geen versienummer.

Alle route-handlers met I/O zitten in `try/catch` en loggen server-side met `console.error` voordat ze een generieke 500 teruggeven.

**Next.js.** `web/src/app/error.tsx` en `web/src/app/not-found.tsx` bestaan, dus onverwachte fouten en 404's krijgen een eigen pagina in plaats van de Next-standaard. `poweredByHeader: false` in `next.config.ts` haalt de `X-Powered-By`-header weg.

De API stuurt nog wel `X-Powered-By: Express` mee (gezien op `/api/uploads/`). Dat verraadt de stack maar geen versie; puur informatie-hygiene.

**Debug-modus.** `NODE_ENV=production` in beide containers, geverifieerd met `docker exec`.

## What's at risk

Niets ernstigs. De `X-Powered-By`-header van de API vertelt een aanvaller dat het Express is, wat hooguit scheelt in de tijd die hij kwijt is aan verkennen.

## What's already secure

Globale handler, generieke meldingen, volledige details alleen in het log, eigen error- en 404-pagina's in Next, en productiemodus in beide containers.

## Recommendations

Optioneel: `app.disable('x-powered-by')` in `api/server.js`, zoals de Verso-API al doet. Een regel, geen risico.
