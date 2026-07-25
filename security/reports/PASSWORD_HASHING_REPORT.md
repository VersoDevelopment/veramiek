# Password Hashing Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: PASS

## Findings

Een wachtwoord in het systeem: het beheerderswachtwoord.

```js
const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
```

bcryptjs met cost 12, wat ruim boven het gangbare minimum van 10 ligt. Verificatie gebeurt met `bcrypt.compareSync()` op twee plekken (`/admin/login` en `/admin/setup`), allebei met `String()` om de invoer heen zodat een JSON-object of array geen typefout in bcrypt kan veroorzaken.

Geen MD5, SHA-1 of kale SHA-256 in het project. Geen zelfgebouwde vergelijking met `===` op hashes.

Naast het wachtwoord staat er een TOTP-tweede factor op de login (`otplib`), met een sleutel die in een Docker-volume staat en niet in git.

Kanttekening, geen bevinding: het wachtwoord staat als platte tekst in `api/.env` en wordt bij elke start opnieuw gehasht. Dat is nodig omdat er geen gebruikersdatabase is en dus geen plek om de hash op te slaan. Zolang `.env` alleen op de server staat en niet in git (geverifieerd, zie SECRETS_EXPOSURE) is dat verdedigbaar.

## What's at risk

Wie het `.env`-bestand op de server kan lezen, heeft het wachtwoord in platte tekst. Dat vraagt echter al toegang tot de container of de host, en dan is de TOTP-sleutel in hetzelfde volume ook binnen bereik.

## What's already secure

bcrypt met cost 12, invoer afgedwongen naar string, en een tweede factor bovenop het wachtwoord.

## Recommendations

Geen. Bij een wachtwoordwissel: `ADMIN_PASSWORD` in `api/.env` aanpassen en de container herstarten.
