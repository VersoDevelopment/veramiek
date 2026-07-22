# Livegang-plan Veramiek (veramiek.nl + www.veramiek.nl)

Status: concept, nog niet uitgevoerd. Datum opgesteld: 22-07-2026.
Doel: veramiek.nl / www.veramiek.nl laten wijzen naar de nieuwe Next.js-site
(`veramiek-app-1`) in plaats van de oude statische site (`veramiek-web-1`).

Technisch runbook voor de container-kant staat in `DEPLOY.md` — dit plan
verwijst daarnaar en herhaalt het niet, maar voegt de stappen toe die daar
nog niet in staan (productdata-sync, e-mail-fix, smoke-test, nazorg).

---

## Update 22/07/2026, Codex

- API-codefix lokaal gedaan: alle mailheaders gebruiken nu `FROM_EMAIL` met fallback naar `CONTACT_EMAIL`, standaard `info@veramiek.nl`. `api/.env.example` is bijgewerkt. Nog open: server-`.env` met Zoho app-wachtwoord vullen, API rebuilden en echte mailtest doen.
- Frontendcontact lokaal gelijkgetrokken naar `info@veramiek.nl`, Instagram `@veramiek.nl` en TikTok `@veramiek`.
- Lokale `api/data/products.json` aangepast: 25 producten totaal, 22 zichtbaar, 3 zonder foto tijdelijk `available:false` (Berry Bowl, Gebaksbordje, Dinerbord). Let op: dit bestand is runtime-data en moet nog los naar de server gesynchroniseerd worden.
- Verificatie lokaal: `node --check api/server.js` schoon, `npm run build` in `web` schoon.

## Fase 0 — Readiness-checklist (vóór je aan de cutover begint)

Vink dit allemaal af voordat je Fase 3 (cutover) start.

- [ ] **Producten compleet in `api/data/products.json`** — huidige stand: 25
      producten, 0 op `available:false`. 3 stuks hebben nog geen foto
      (Berry Bowl, Gebaksbordje, Dinerbord) — met Vera afstemmen: foto
      erbij vóór livegang, of tijdelijk `available:false` zetten zodat ze
      niet kaal in de webshop staan.
- [ ] **Collectiefoto's compleet**: `web/public/images/collecties/{boeren-bontjes,kust-koraal,zeeuws-zand}` —
      elk 4 bestanden aanwezig, gecommit en gepusht (`git log origin/master` =
      `git log HEAD`, gecontroleerd 22-07: in orde).
- [ ] **Herobeeld/-video op de server aanwezig** — check vóórdat je gaat
      builden, want dit bestand zit bewust niet in git (zie DEPLOY.md):
      ```bash
      ssh kenny@versodevelopment.nl "ls -la /var/www/veramiek/web/public/videos/hero-breda-warmrays.mp4"
      ```
      Ontbreekt hij → eerst opnieuw plaatsen (commando staat in DEPLOY.md)
      vóórdat je `docker compose build next` draait, anders bak je een image
      zonder video en valt het pas na livegang op.
- [ ] **E-mail is gefixt** — zie Fase 2 hieronder. Dit is een blocker: zonder
      fix verstuurt de site bestel- en contactmails "namens" een verkeerd
      domein.
- [ ] **DNS**: `veramiek.nl` A/AAAA wijst al naar de Hetzner-VPS (staat al zo,
      anders draaide de oude site er niet op). Alleen de DMARC-TXT ontbreekt
      nog (zie Fase 2). Controleer bij welke registrar veramiek.nl beheerd
      wordt en of jij (Kenny) daar zelf bij kan — dit staat niet
      gedocumenteerd zoals de OVH-zone van versodevelopment.nl.
- [ ] **Proefversie is groen**: laatste build van `veramiek-next-1` +
      `veramiek-api-1` draait en de smoke-test (Fase 4) is al één keer
      succesvol doorlopen op `https://veramiek.versodevelopment.nl` (met
      basic-auth), zodat de cutover zelf geen nieuwe bugs introduceert.
- [ ] **Vera is geïnformeerd** over het tijdstip van livegang en weet dat het
      adminpaneel-adres straks `https://veramiek.nl/api/` wordt (was de
      proefversie-URL).
- [ ] **Moment kiezen**: buiten piekuren, en niet vlak voor een weekend als
      Kenny niet bereikbaar is voor een eventuele rollback.

---

## Fase 1 — Productdata-sync (kritiek, staat niet in DEPLOY.md)

**Waarom dit apart moet:** `api/data/products.json` staat in `.gitignore`
(`api/.gitignore`: "Runtime data, hoort niet in git, is in productie een
Docker-volume"). Al het productwerk van vandaag (25 producten, nieuwe
collectiekoppelingen, verwijderde duplicaten) staat dus **alleen lokaal**.
`git pull` op de server raakt dit bestand nooit aan — de server-volume
`veramiek_api_data` heeft nog de oude/lege set.

De foto's zelf hoeven niet apart gesynchroniseerd te worden: die staan onder
`web/public/images/...`, zijn **wél** gecommit en gepusht, en komen gewoon
mee met de normale `git pull && docker compose build next` uit DEPLOY.md.

**Extra: `server.js` leest `products.json` maar één keer in, bij opstarten**
(`let products = [...]` bovenaan, gevuld uit het bestand; endpoints muteren
alleen de in-memory array + schrijven die terug weg). Het bestand op de
server overschrijven is dus **niet genoeg** — de API-container moet daarna
herstart worden, anders blijft de oude set in het geheugen zitten totdat er
toevallig een `docker compose up` gebeurt.

Er is geen import/export-functie in het adminpaneel (`admin.html`) of een
API-route ervoor — daarom hieronder de handmatige, veilige route via
`docker cp` in plaats van het hele volume te overschrijven (dat zou ook
`bookings.json`, `blocked_dates.json`, `workshops.json`, `totp_secret.txt`
in dezelfde map raken als je per ongeluk de verkeerde map/tar gebruikt).

**Stappen:**

1. Lokaal controleren wat je gaat versturen:
   ```bash
   node -e "console.log(require('./api/data/products.json').length)"   # verwacht: 25
   ```
2. Backup maken van de LIVE serverversie, vóór je iets overschrijft
   (de lokale `.bak-voor-live-import` is een oude lokale kopie, geen
   afspiegeling van wat er nu op de server staat):
   ```bash
   ssh kenny@versodevelopment.nl \
     "docker exec veramiek-api-1 cp /app/data/products.json /app/data/products.json.bak-$(date +%Y%m%d)"
   ```
3. Nieuw bestand naar de server kopiëren (los bestand, niet de hele map):
   ```bash
   scp "api/data/products.json" kenny@versodevelopment.nl:/tmp/products.json
   ```
4. Vanaf `/tmp` in het draaiende volume zetten (dit schrijft direct in de
   named volume `veramiek_api_data`, zonder de container te herbouwen):
   ```bash
   ssh kenny@versodevelopment.nl \
     "docker cp /tmp/products.json veramiek-api-1:/app/data/products.json && rm /tmp/products.json"
   ```
5. API-container herstarten zodat hij het nieuwe bestand inleest
   (`docker restart` is genoeg, geen `up`/rebuild nodig — de volume-mount
   blijft ongewijzigd):
   ```bash
   ssh kenny@versodevelopment.nl "docker restart veramiek-api-1"
   ```
6. Verifiëren (tegen de proefversie, vóór de cutover):
   ```bash
   curl -s -u vera:<wachtwoord> https://veramiek.versodevelopment.nl/api/products | node -e \
     "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).length))"
   # verwacht: 25
   ```
7. Steekproef in de browser: open 2-3 producten uit elke nieuwe collectie
   (Boeren Bontjes, Kust Koraal, Zeeuws Zand) en check dat de foto's laden
   (404's zouden duiden op een pad-mismatch tussen `products.json` en de
   daadwerkelijke bestandsnamen in `web/public/images/producten/`).

Dit kan en moet je **vóór** de nginx-cutover doen — het raakt alleen de
gedeelde API, niet welke frontend erop wijst, en de oude statische site
gebruikt dezelfde `/api/products`, dus zowel oud als nieuw tonen daarna de
nieuwe set. Dat is geen probleem: de oude site verdwijnt toch binnenkort.

---

## Fase 2 — E-mail: SMTP + DMARC (blocker vóór livegang)

**Twee gescheiden problemen, allebei moeten opgelost:**

**A. Verkeerd verzendadres, hardcoded in code (niet alleen een env-var).**
`api/server.js` heeft op 5 plekken een hardcoded `from:`:
```
from: '"Veramiek Website" <info@versodevelopment.nl>'
from: '"Vera, Veramiek" <info@versodevelopment.nl>'   (2x)
from: '"Veramiek Webshop" <info@versodevelopment.nl>'
from: '"Veramiek Workshops" <info@versodevelopment.nl>'
```
Dit is los van `process.env.SMTP_USER` (die wordt alleen gebruikt voor de
SMTP-authenticatie, niet voor de header). Zelfs als je straks
`SMTP_USER=info@veramiek.nl` zet, blijven de verstuurde mails "namens"
`info@versodevelopment.nl` staan zolang de code niet wijzigt. Erger: een
From-header op een ander domein dan het geauthenticeerde SMTP-account zorgt
voor een DMARC/SPF-alignment-mismatch op het veramiek.nl-domein — precies
het risico dat hieronder staat.

Actie:
- [ ] Wijzig de 5 `from:`-regels naar `info@veramiek.nl` (of, netter, lees
      het uit een nieuwe env-var `FROM_EMAIL`, zodat dit niet opnieuw
      hardcoded staat voor een volgend project — vergelijkbaar met hoe caya
      dit al met `FROM_EMAIL` doet).
- [ ] Rebuild + herdeploy de API:
      ```bash
      ssh kenny@versodevelopment.nl "cd /var/www/veramiek && docker compose build api && docker compose up -d api"
      ```

**B. SMTP-credentials + DMARC.**
- [ ] In Zoho: eigen mailbox/alias `info@veramiek.nl` aanmaken (indien nog
      niet gedaan) + een app-specifiek wachtwoord genereren (Zoho staat geen
      gewoon wachtwoord toe voor SMTP-auth).
- [ ] Server-`.env` (`/var/www/veramiek/api/.env`) bijwerken:
      ```
      SMTP_USER=info@veramiek.nl
      SMTP_PASS=<nieuw app-wachtwoord>
      ```
      (na wijziging: `docker compose up -d api`, of samen met de rebuild
      van punt A hierboven in één stap).
- [ ] DMARC-TXT-record toevoegen op veramiek.nl (SPF en DKIM staan al goed,
      volgens dezelfde methode als versodevelopment.nl):
      ```
      _dmarc.veramiek.nl TXT "v=DMARC1; p=none; rua=mailto:info@veramiek.nl; fo=1"
      ```
      Start bewust met `p=none` (monitoring, geen afkeuring), later evt.
      optrekken naar `p=quarantine` zoals bij versodevelopment.nl.
- [ ] Verifiëren met een test-run via mail-tester.com (zelfde methode als
      eerder bij versodevelopment.nl gebruikt: testadres genereren, testmail
      versturen via de echte Zoho-SMTP-credentials, score + SPF/DKIM/DMARC
      resultaat ophalen via `GET https://www.mail-tester.com/check?id=<adres>`).
      Streef naar alle drie `pass`.

**Risico als je dit overslaat:** bestel- en contactmails komen bij Vera aan
alsof ze van `versodevelopment.nl` verstuurd zijn (verwarrend, en Vera's
eigen antwoord-adres klopt dan niet), én zonder DMARC kan een deel van de
mail als spam gemarkeerd worden of zelfs geweigerd worden door de
ontvangende mailserver (Gmail/Outlook zijn hier sinds 2024 streng in).
Order- en contact-flow lijkt in de admin/logs dan te "werken" terwijl de
klant de mail nooit ziet — lastig te ontdekken zonder expliciet te testen.

---

## Fase 3 — De cutover zelf

Samengevat uit `DEPLOY.md` (zie daar voor het volledige detail):

1. Laatste `git pull` + `docker compose build next` + `docker compose up -d
   next app` draaien op de server, zodat de nieuwste code (incl. de
   e-mail-fix uit Fase 2 en de foto's uit Fase 0) live staat op het
   stagingdomein. Nogmaals kort testen op
   `https://veramiek.versodevelopment.nl`.
2. NGINX Proxy Manager openen (`http://178.105.162.140:81`, alleen vanaf
   Kenny's IP), proxy host `veramiek.nl, www.veramiek.nl` (`3.conf`):
   forward hostname van `veramiek-web-1` → `veramiek-app-1`, poort blijft 80.
   Opslaan; NPM herlaadt zelf.
3. Het basic-auth-wachtwoord en de `noindex`-header vervallen automatisch
   zodra het verkeer via het `veramiek.nl`-hostname binnenkomt (host-based
   `map`-blokken in `nginx-app.conf`, geen aparte actie nodig).

**Rollback:** forward hostname in NPM terugzetten naar `veramiek-web-1`. De
oude site blijft draaien, er is niets verwijderd. Let op: de productdata-sync
uit Fase 1 raakt de gedeelde API en wordt dus **niet** teruggedraaid door een
rollback van de NPM-forward — dat is prima, want de oude site toont dan
gewoon ook de nieuwe productset (die is inhoudelijk beter, geen reden om dat
terug te draaien).

---

## Fase 4 — Smoke-test direct na de cutover

Test op `https://veramiek.nl` én `https://www.veramiek.nl` (beide domeinen
zitten op dezelfde proxy host, maar los checken kost niks):

- [ ] **Homepage** laadt, hero-video speelt af (niet alleen posterframe),
      geen console-errors.
- [ ] **Collecties-overzicht** (`/collecties`): filter werkt, alle drie de
      nieuwe collecties (Boeren Bontjes, Kust Koraal, Zeeuws Zand) tonen
      producten met foto's.
- [ ] **Product-detail** (`/collecties/[id]`): opent, foto's laden, "in
      winkelwagen" werkt.
- [ ] **Winkelwagen → bestellen** (`/winkelwagen` → `POST /send-order`):
      test-bestelling plaatsen met een adres van Kenny zelf, controleren dat
      (a) de mail bij Vera aankomt met afzender `info@veramiek.nl`, en (b)
      de bevestigingsmail bij de "klant" (Kenny) aankomt.
- [ ] **Contactformulier** (`/contact` → `POST /send-contact`): testbericht
      versturen, mail controleren (afzender + inhoud).
- [ ] **Workshops-boeking** (`/workshops` → `BookingCalendar` → `POST
      /book`): test-boeking maken, controleren dat de boeking in het
      adminpaneel verschijnt (tab "Boekingen") én dat de .ics-uitnodiging in
      de mail zit en importeerbaar is.
- [ ] **Adminpaneel bereikbaar**: `https://veramiek.nl/api/` opent, login
      (wachtwoord + TOTP) werkt, productenlijst toont 25 items, tab
      Boekingen toont de testboeking van hierboven.
- [ ] **robots/SEO-check**: `curl -sI https://veramiek.nl/` bevat geen
      `X-Robots-Tag: noindex` meer en geeft geen 401 (basic-auth is weg).
- [ ] **SSL**: certificaat geldig voor beide hostnamen (NPM regelt dit al
      via de bestaande `3.conf`, maar even bevestigen na de switch).

Test-bestelling/-boeking na afloop opruimen (of laten staan als testdata,
even met Vera afstemmen) zodat haar eerste live-overzicht niet vervuild is.

---

## Fase 5 — Nazorg

- [ ] **Monitoring**: UptimeRobot-check (bestaat al voor de VPS) toevoegen
      of aanpassen zodat hij specifiek `https://veramiek.nl/` pingt, niet
      alleen het staging-adres.
- [ ] **Server blijft in de gaten houden** de eerste 24-48 uur:
      ```bash
      ssh kenny@versodevelopment.nl "docker logs -f --tail 100 veramiek-api-1"
      ```
      let op 5xx's op `/send-order`, `/send-contact`, `/book`.
- [ ] **Wie waarschuwen bij problemen**: Kenny zelf (kenny.van.teeffelen@gmail.com,
      telefonisch/WhatsApp) — dit is een eenmansproject, geen escalatiepad
      nodig, maar spreek met Vera af dat ze bij twijfel (site plat, mail komt
      niet aan) direct appt in plaats van te wachten.
- [ ] **Oude site (`veramiek-web-1`) en oude bestanden pas verwijderen** als
      de nieuwe site "een paar weken goed heeft gedraaid" (letterlijk de
      afspraak uit DEPLOY.md) — dus niet op dag 1, wel als vast agendapunt
      voor ~medio augustus 2026 zetten.
- [ ] **Disk-opruiming**: na de rebuild-cyclus van deze livegang eventueel
      `docker image prune -a -f` op de server (bekende disk-valkuil uit het
      onderhoudsplan), niet per se nu al urgent.
- [ ] Server-side backup van `products.json.bak-<datum>` (Fase 1, stap 2)
      een tijdje bewaren voor het geval de sync toch iets miste.

---

## Open risico's / bekende gaten (niet blokkerend voor livegang, wel noemen)

- **Geen online betaling.** Bewuste keuze (zie projectgeheugen 08/07/2026):
  webshop werkt met winkelwagen + e-mailorder, Vera regelt betaling/afhandeling
  zelf na ontvangst van de bestelmail. Geen Stripe/Mollie-integratie gepland
  in deze fase.
- **DNS-beheer veramiek.nl niet gedocumenteerd** — in tegenstelling tot
  versodevelopment.nl (OVH, token bekend) staat nergens vastgelegd wie de
  DNS-zone van veramiek.nl beheert. Nodig om de DMARC-record (Fase 2) te
  kunnen zetten; dit even uitzoeken is zelf al een actiepunt.
- **Adminpaneel-authenticatie** is wachtwoord + TOTP zonder wachtwoord-reset-
  flow via e-mail — als Vera haar TOTP-app kwijtraakt, moet dat handmatig
  door Kenny hersteld worden op de server (`totp_secret.txt`).
- **Eén VPS, single point of failure** — al langer bekend open punt uit het
  infrastructuurgeheugen, niet specifiek voor deze livegang maar relevant
  om aan Vera te blijven melden.
- **3 producten zonder foto** (Berry Bowl, Gebaksbordje, Dinerbord) — als
  Fase 0 dit niet oplost vóór livegang, komen deze zonder afbeelding live
  (placeholder in de UI, geen crash, maar oogt onaf).
- **From-adres nu hardcoded** (Fase 2, punt A) — ook na de fix van dit
  moment blijft het risico bestaan dat een volgende wijziging dit weer
  per ongeluk terugzet; overwegen om dit structureel naar een env-var te
  verplaatsen in plaats van een eenmalige losse patch.
