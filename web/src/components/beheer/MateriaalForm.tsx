"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/api";
import { BeheerFout, bewaarContent, haalContent } from "@/lib/beheer";
import { Blok, Knop, Tekstvlak, Veld } from "./Veld";

type Materiaal = NonNullable<SiteContent["material"]>;

const LEEG: Materiaal = {
  clay: "",
  dishwasher: "",
  microwave: "",
  oven: "",
  maintenance: "",
};

/**
 * De gegevens die voor het hele assortiment gelden. Die staan bewust niet bij
 * elk product: Vera zou ze dan vijfentwintig keer moeten invullen en bij een
 * andere klei ook vijfentwintig keer moeten bijwerken. De productpagina zet ze
 * onder de eigen specificaties van het stuk.
 *
 * Glazuur hoort hier bewust niet bij: dat verschilt per collectie en staat dus
 * op het product zelf.
 */
export function MateriaalForm() {
  const [waarden, setWaarden] = useState<Materiaal>(LEEG);
  const [laden, setLaden] = useState(true);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [bewaard, setBewaard] = useState(false);

  useEffect(() => {
    let actief = true;
    haalContent()
      .then((content) => {
        if (actief) setWaarden({ ...LEEG, ...content.material });
      })
      .catch((error) => {
        if (actief) {
          setFout(
            error instanceof BeheerFout
              ? error.message
              : "De teksten konden niet geladen worden.",
          );
        }
      })
      .finally(() => {
        if (actief) setLaden(false);
      });
    return () => {
      actief = false;
    };
  }, []);

  function zet(sleutel: keyof Materiaal, waarde: string) {
    setWaarden((vorige) => ({ ...vorige, [sleutel]: waarde }));
    setBewaard(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFout("");
    try {
      await bewaarContent({ material: waarden });
      setBewaard(true);
    } catch (error) {
      setFout(error instanceof BeheerFout ? error.message : "Opslaan mislukt.");
    } finally {
      setBezig(false);
    }
  }

  if (laden) {
    return (
      <p className="py-10 text-[0.95rem] text-wine/60">Bezig met laden...</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Blok
        titel="Materiaal en gebruik"
        uitleg="Een keer invullen. Dit verschijnt op de pagina van elk product, onder de gegevens van het stuk zelf."
      >
        <Veld
          id="m-klei"
          label="Klei"
          waarde={waarden.clay ?? ""}
          onChange={(v) => zet("clay", v)}
          placeholder="wit steengoed"
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <Veld
            id="m-vaatwasser"
            label="Vaatwasser"
            waarde={waarden.dishwasher ?? ""}
            onChange={(v) => zet("dishwasher", v)}
            placeholder="ja"
          />
          <Veld
            id="m-magnetron"
            label="Magnetron"
            waarde={waarden.microwave ?? ""}
            onChange={(v) => zet("microwave", v)}
            placeholder="ja"
          />
          <Veld
            id="m-oven"
            label="Oven"
            waarde={waarden.oven ?? ""}
            onChange={(v) => zet("oven", v)}
            placeholder="nee"
          />
        </div>

        <Tekstvlak
          id="m-onderhoud"
          label="Hoe houdt iemand het mooi"
          regels={3}
          waarde={waarden.maintenance ?? ""}
          onChange={(v) => zet("maintenance", v)}
          placeholder="Mag in de vaatwasser, maar met de hand afwassen houdt de kleur langer diep."
        />
      </Blok>

      <div className="flex items-center gap-4">
        <Knop type="submit" soort="vol" disabled={bezig}>
          {bezig ? "Opslaan..." : "Opslaan"}
        </Knop>
        <div aria-live="polite">
          {fout && <span className="text-[0.9rem] text-wine">{fout}</span>}
          {bewaard && !fout && (
            <span className="text-[0.9rem] text-wine/60">Opgeslagen.</span>
          )}
        </div>
      </div>
    </form>
  );
}
