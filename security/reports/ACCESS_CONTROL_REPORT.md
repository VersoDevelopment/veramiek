# Access Control Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Veramiek kent een enkele gebruiker: Vera als beheerder. Er zijn geen accounts, geen eigenaarsvelden en dus geen resources van gebruiker A die gebruiker B zou kunnen opvragen. Het JWT bevat alleen `{ admin: true }`.

Routes met een resource-id in het pad, allemaal met `auth` ervoor:

- `PUT/DELETE /admin/products/:id`
- `PUT/DELETE /admin/workshops/:id`
- `PUT/DELETE /admin/bookings/:id`
- `DELETE /admin/blocked-dates/:date`

Alle vier zoeken de resource op met `findIndex`/`find` en geven 404 als die niet bestaat. Omdat er maar een eigenaar is, valt eigendom samen met authenticatie.

Ook gecontroleerd of een id ooit als pad gebruikt wordt (path traversal via `:id`): nee, de id's worden alleen vergeleken met waarden in een array, nooit aan `path.join` of `fs` doorgegeven. `DELETE /admin/blocked-dates/:date` gebruikt `indexOf` op een array met strings.

## What's at risk

Niets binnen deze categorie. Het enige toegangsniveau is "beheerder of niet", en dat wordt door `auth` afgedwongen.

## What's already secure

Geen ruwe id's naar het bestandssysteem, 404 op onbekende id's, en alle wijzigende routes achter dezelfde middleware.

## Recommendations

Komt er ooit een tweede beheerder of een klantaccount bij, dan moet deze categorie opnieuw: dan is `auth` alleen niet meer genoeg en is een expliciete eigendomscheck per resource nodig.
