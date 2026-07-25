# Payment Webhooks Security Report

**Project:** Veramiek (veramiek.nl)
**Datum:** 25/07/2026

## Status: N/A

## Findings

Geen betalingen op veramiek.nl. Geen Stripe, Mollie of andere PSP in `api/package.json` of in de frontend. Bestellingen lopen via `POST /send-order`, dat twee mails verstuurt (een naar Vera, een bevestiging naar de koper); de afhandeling en betaling gaan daarna buiten de site om.

Er is dus ook geen webhook-endpoint dat een handtekening zou moeten controleren.

## What's at risk

Niets binnen deze categorie. Wel goed om te weten: omdat er geen betaling in de flow zit, is een bestelling niet meer dan een aanvraag per mail. Dat is een bewuste keuze en geen kwetsbaarheid.

## What's already secure

Niet van toepassing.

## Recommendations

Komt er later iDEAL of Stripe bij, dan geldt deze categorie volledig: handtekeningverificatie op elke webhook, verwerkte event-id's opslaan tegen dubbele verwerking, en handlers voor mislukte betalingen.
