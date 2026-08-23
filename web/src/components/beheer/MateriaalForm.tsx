"use client";

import { useEffect, useState } from "react";
import { Field, TextAreaField } from "@/components/ui/Field";
import type { SiteContent } from "@/lib/api";
import { BeheerFout, bewaarContent, haalContent } from "@/lib/beheer";

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
    return <p className="py-10 text-base text-wine/70">Bezig met laden...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <p className="text-base text-wine/70">
        Dit hoef je maar een keer in te vullen. Het verschijnt op de pagina van
        elk product, onder de gegevens van het stuk zelf.
      </p>

      <Field
        id="m-klei"
        name="klei"
        label="Klei"
        value={waarden.clay ?? ""}
        onChange={(v) => zet("clay", v)}
        placeholder="wit steengoed"
      />

      <div className="grid gap-8 sm:grid-cols-3">
        <Field
          id="m-vaatwasser"
          name="vaatwasser"
          label="Vaatwasser"
          value={waarden.dishwasher ?? ""}
          onChange={(v) => zet("dishwasher", v)}
          placeholder="ja"
        />
        <Field
          id="m-magnetron"
          name="magnetron"
          label="Magnetron"
          value={waarden.microwave ?? ""}
          onChange={(v) => zet("microwave", v)}
          placeholder="ja"
        />
        <Field
          id="m-oven"
          name="oven"
          label="Oven"
          value={waarden.oven ?? ""}
          onChange={(v) => zet("oven", v)}
          placeholder="nee"
        />
      </div>

      <TextAreaField
        id="m-onderhoud"
        name="onderhoud"
        label="Hoe houdt iemand het mooi"
        rows={3}
        value={waarden.maintenance ?? ""}
        onChange={(v) => zet("maintenance", v)}
        placeholder="Mag in de vaatwasser, maar met de hand afwassen houdt de kleur langer diep."
      />

      <div aria-live="polite" className="min-h-[1.5rem]">
        {fout && <p className="text-base text-wine">{fout}</p>}
        {bewaard && !fout && (
          <p className="text-base text-wine/70">Opgeslagen.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={bezig}
        className="inline-flex cursor-pointer items-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {bezig ? "Opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}
