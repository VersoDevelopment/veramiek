# Xss Fix Plan

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Changes

- `web/src/lib/jsonLd.ts` (nieuw) - `jsonLdScript()` die `&`, `<`, `>`, U+2028 en U+2029 naar unicode-escapes omzet, zodat de JSON geldig blijft maar nooit een tag kan afsluiten.
- `web/src/app/collecties/[id]/page.tsx` - gebruikt `jsonLdScript(productJsonLd)`.
- `web/src/app/layout.tsx` - gebruikt `jsonLdScript(orgJsonLd)`, zodat er maar een manier is om JSON-LD te schrijven.

## New files

- `web/src/lib/jsonLd.ts`

## Verification goals

- [x] Geen `dangerouslySetInnerHTML` meer met kale `JSON.stringify`
- [x] `jsonLdScript({name: "</script><img src=x onerror=alert(1)>"})` bevat geen `</script` en geen rauwe `<` of `>`
- [x] De uitvoer blijft geldige JSON (`JSON.parse` geeft de oorspronkelijke waarde terug)
- [x] `npx tsc --noEmit` en `npm run build` slagen

## Manual verification (for Kenny)

Openstaand, lage prioriteit: `esc()` in `api/admin.html` uitbreiden met `.replace(/'/g,'&#39;')` en `p.images[0]` erdoorheen halen. Alleen relevant als een productnaam of foto-URL ooit een apostrof of aanhalingsteken bevat.
