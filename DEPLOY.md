# Veramiek: deployen

Server: `kenny@versodevelopment.nl`, map `/var/www/veramiek`. Er staat wel een
git-checkout op de server, dus deployen gaat via `git pull` (anders dan CAYA en
WebsiteMatch).

## Wat er draait

| Container | Wat | Poort | Bereikbaar via |
|---|---|---|---|
| `veramiek-web-1` | Oude statische site (`index.html`, `styles.css`) | 8082 | veramiek.nl, tot de cutover |
| `veramiek-app-1` | nginx-voorkant van de nieuwe site | 8083 | veramiek.versodevelopment.nl (proefversie) |
| `veramiek-next-1` | De Next.js-site | 3000 (intern) | via `veramiek-app-1` |
| `veramiek-api-1` | Express-API, adminpaneel, uploads | 3001 (intern) | `/api/` op beide sites |

De oude en de nieuwe site delen dezelfde API. Producten die Vera in het
adminpaneel aanpast, veranderen dus op allebei tegelijk.

## Twee valkuilen, lees dit eerst

**1. De hero-video zit niet in git.** `.gitignore` sluit `*.mp4` uit, dus
`web/public/videos/hero-breda-warmrays.mp4` (29 MB) komt nooit mee met een
`git pull`. Hij staat los op de server en moet daar blijven staan. Bouw je de
image op een verse checkout zonder dat bestand, dan toont de hero alleen het
posterframe en valt niemand het meteen op.

Opnieuw plaatsen:

```bash
scp "web/public/videos/hero-breda-warmrays.mp4" \
  kenny@versodevelopment.nl:/var/www/veramiek/web/public/videos/
```

**2. Bind-mounts van losse bestanden overleven een reload niet.**
`nginx-app.conf` en `.htpasswd` zijn single-file mounts. `git pull` vervangt het
bestand door een nieuwe inode, maar de draaiende container blijft de oude zien.
`nginx -s reload` pikt de wijziging dus **niet** op. Altijd de container
opnieuw aanmaken:

```bash
docker rm -f veramiek-app-1 && docker compose up -d app
```

## Nieuwe versie uitrollen

```bash
ssh kenny@versodevelopment.nl
cd /var/www/veramiek
git pull
docker compose build next
docker compose up -d next app
docker network connect npm_default veramiek-next-1 2>/dev/null || true
docker network connect npm_default veramiek-app-1 2>/dev/null || true
```

Controleren:

```bash
curl -sI -u vera:<wachtwoord> https://veramiek.versodevelopment.nl/ | head -5
curl -s  -u vera:<wachtwoord> https://veramiek.versodevelopment.nl/api/products | head -c 200
```

## De cutover naar veramiek.nl

De nieuwe site is gebouwd met `SITE_URL=https://veramiek.nl`, dus canonicals en
og:url kloppen al. **De cutover vraagt geen herbouw**, alleen een omzetting in
NGINX Proxy Manager:

1. NPM openen (`http://178.105.162.140:81`, alleen vanaf Kenny's IP).
2. Proxy host `veramiek.nl, www.veramiek.nl` (dat is `3.conf`): forward hostname
   van `veramiek-web-1` naar `veramiek-app-1`, poort blijft 80.
3. Opslaan. NPM herlaadt zelf.

Het wachtwoord en de `X-Robots-Tag: noindex` gelden alleen op het stagingdomein
(zie de `map`-blokken bovenin `nginx-app.conf`), dus die verdwijnen vanzelf
zodra het verkeer via `veramiek.nl` binnenkomt.

**Terugval:** zet de forward hostname terug op `veramiek-web-1`. De oude site
blijft gewoon draaien, er wordt niets weggegooid. Verwijder `veramiek-web-1`
en de oude bestanden pas als de nieuwe site een paar weken goed heeft gedraaid.

## De API

Wordt niet aangeraakt bij een site-deploy. Wel bij een wijziging in
`api/server.js`:

```bash
docker compose build api && docker compose up -d api
```

De data (`products.json`, `bookings.json`, uploads) staat in de docker-volumes
`veramiek_api_data` en `veramiek_api_uploads`, niet in de map. Een rebuild raakt
die dus niet.

Adminpaneel voor Vera: `https://veramiek.nl/api/` (na de cutover hetzelfde adres).
