# Rate Limiting Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

| Limiet | Venster | Max | Routes |
|---|---|---|---|
| `globalLimit` | 60s | 200 | alles (met uitzondering voor intern verkeer) |
| `loginLimit` | 15 min | 5 | `POST /admin/login` |
| `setupLimit` | 15 min | 5 | `POST /admin/setup` |
| `contactLimit` | 60s | 3 | `POST /send-contact` |
| `orderLimit` | 60s | 3 | `POST /send-order` |
| `bookLimit` | 60s | 3 | `POST /book` |
| `uploadLimit` | 60s | 20 | `POST /admin/upload` |

`app.set('trust proxy', 1)` past bij de opstelling: NGINX Proxy Manager zet `X-Forwarded-For`, en `nginx-app.conf` geeft die bewust door met `$http_x_forwarded_for` in plaats van hem aan te vullen. Zou de app-nginx zijn eigen IP toevoegen, dan zag de limiter iedereen als dezelfde bezoeker.

`isInternalRequest()` slaat de globale limiet over voor privé-IP's. Dat is nodig omdat de Next-container server-side rendert en al zijn API-verkeer vanaf een enkel container-IP komt; zonder de uitzondering zou een zoekmachine die snel door de productpagina's loopt de limiet voor de hele site opsouperen. De uitzondering is veilig omdat publiek verkeer altijd via de proxy komt en `req.ip` dan het echte bezoekers-IP is, nooit een privéadres.

Live getest: 7 mislukte inlogpogingen achter elkaar geven `401 401 401 401 429 429 429`. Een poging met `X-Forwarded-For: 1.2.3.4` kreeg ook 429, dus de teller is niet te resetten door de header te vervalsen.

## What's at risk

Niets ernstigs. Het contactformulier laat 3 mails per minuut per IP toe; over een langere periode is dat nog steeds mailruis als iemand doorzet, maar de honeypot vangt de meeste bots af.

## What's already secure

Login op 5 per 15 minuten, alle mailroutes op 3 per minuut, een globale bovengrens, en een proxy-instelling die klopt met de werkelijke keten.

## Recommendations

Geen. De aanbeveling uit het framework (10 per 15 min op login) is hier strenger ingevuld.
