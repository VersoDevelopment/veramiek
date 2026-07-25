/**
 * Serialiseert een object voor een `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alleen is niet genoeg: het laat `<` en `>` ongemoeid, dus
 * een productnaam met `</script>` erin sluit het scriptblok vroegtijdig en
 * de rest van de string belandt als HTML in de pagina. Producten komen uit het
 * adminpaneel, dus dat is geen bezoekersinvoer, maar het is wel de enige plek
 * waar externe data ongefilterd in de HTML terechtkomt.
 *
 * De vervangingen hieronder zijn de standaardset: `<`/`>` tegen het afsluiten
 * van de tag, `&` zodat de escapes zelf niet te vervalsen zijn, en
 * U+2028/U+2029 omdat die in JavaScript als regeleindes tellen en de JSON
 * anders ongeldig maken.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
