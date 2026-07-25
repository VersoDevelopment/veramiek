# Xss Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: MEDIUM (gefixt)

## Findings

**Frontend (`web/src`).** Twee plekken met `dangerouslySetInnerHTML`, allebei JSON-LD:

1. `web/src/app/layout.tsx:131` - organisatie-markup, volledig in de broncode geschreven. Veilig.
2. `web/src/app/collecties/[id]/page.tsx:70` - product-markup, met `product.name`, `product.desc` en `product.images` uit de API.

Bij die tweede stond `JSON.stringify(productJsonLd)` en dat is niet genoeg. `JSON.stringify` laat `<` en `>` ongemoeid, dus een productnaam als `</script><img src=x onerror=...>` sluit het scriptblok vroegtijdig en de rest belandt als HTML in de pagina. Producten komen uit het adminpaneel, dus de injectie vraagt een ingelogde beheerder, maar het resultaat is opgeslagen XSS die bij elke bezoeker van die productpagina afgaat.

Verder in de frontend: geen `innerHTML`, geen `eval`, geen `document.write`. React escapet de rest van de productvelden automatisch.

**Adminpaneel (`api/admin.html`).** Gebruikt op zeven plekken `innerHTML` met data uit de API. De belangrijkste is `renderBookings()`, want boekingen komen van het publieke `POST /book`, dus een willekeurige bezoeker kan de inhoud bepalen. Alle vier de velden die daar terechtkomen (`naam`, `email`, `tel`, `bericht`) gaan door `esc()`, dus de aanval slaagt niet. Wel opgemerkt:

- `esc()` escapet `&`, `<`, `>` en `"`, maar niet `'`. Bij `confirmDelete('${p.id}', '${esc(p.name)}')` staat de waarde in een JavaScript-string met enkele quotes binnen een HTML-attribuut, dus een productnaam met een apostrof breekt daar uit. Alleen door een ingelogde beheerder te vullen, dus zelf-XSS.
- `<img src="${p.images[0]}">` staat helemaal niet door `esc()`. Zelfde beperking: admin-only.

**E-mails.** Alle bezoekersinvoer gaat door `escapeHtml()` voordat het in de mailtemplates komt.

## What's at risk

Voor de fix: een beheerder die een productnaam met `</script>` erin plakt (bijvoorbeeld gekopieerd uit een bron die dat bevat) publiceert daarmee ongemerkt uitvoerbare HTML op een publieke productpagina. Geen aanval vanaf de straat, wel een reeel foutscenario.

## What's already secure

Boekingen en contactberichten (de enige velden die een willekeurige bezoeker vult) zijn overal geescaped: in het adminpaneel via `esc()` en in de mails via `escapeHtml()`. De frontend gebruikt verder alleen React-rendering.

## Recommendations

1. JSON-LD escapen in plaats van kaal `JSON.stringify`. Gedaan.
2. `esc()` in `admin.html` ook `'` laten escapen, en de `img src` erdoorheen halen. Lage prioriteit (admin-only), maar het is een regel werk.
