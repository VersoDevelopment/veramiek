# Startgegevens

Deze map bevat data die eenmalig in het docker-volume van de API is gezet.
De echte data staat in `/app/data` in de container (volume `api_data`) en is
daarom niet in git te volgen; dit is de kopie waarmee het begon.

## blogs.json

De vijf blogartikelen die eerder als vaste lijst in `web/src/lib/content.ts`
stonden. Sinds 23/08/2026 komen blogs uit de API zodat ze in het beheerscherm
te schrijven zijn, en is die lijst uit de code gehaald.

Terugzetten of opnieuw plaatsen:

```bash
scp api/data-seed/blogs.json kenny@versodevelopment.nl:/tmp/blogs.json
ssh kenny@versodevelopment.nl \
  "docker cp /tmp/blogs.json veramiek-api-1:/app/data/blogs.json && docker restart veramiek-api-1"
```

Let op: dat overschrijft wat Vera sindsdien heeft geschreven. Maak eerst een
kopie van het bestaande bestand.
