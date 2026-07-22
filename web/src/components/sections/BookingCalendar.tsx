"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Field, TextAreaField, Honeypot } from "@/components/ui/Field";
import {
  createBooking,
  getAvailability,
  type Availability,
  type Workshop,
} from "@/lib/api";

type Status = "idle" | "sending" | "done" | "error";

const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
/** Vandaag als YYYY-MM-DD in de lokale tijd van de bezoeker. */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
/** Maandindex (0-based) waarop weekdag maandag = 0. */
function mondayFirst(weekday: number) {
  return (weekday + 6) % 7;
}

export function BookingCalendar({ workshops }: { workshops: Workshop[] }) {
  const today = useMemo(() => todayStr(), []);
  const now = useMemo(() => new Date(), []);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [availability, setAvailability] = useState<Availability>({});
  const [selected, setSelected] = useState<string | null>(null);
  /** Aanvrager heeft bewust geen voorkeursdatum; dan mag het formulier ook zonder `selected` open. */
  const [noDatePreference, setNoDatePreference] = useState(false);
  const [workshopId, setWorkshopId] = useState(workshops[0]?.id ?? "");

  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [aantal, setAantal] = useState("4");
  const [bericht, setBericht] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const maandKey = `${year}-${pad(month + 1)}`;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getAvailability(maandKey).then((a) => {
      if (active) setAvailability(a);
    });
    return () => {
      active = false;
    };
  }, [maandKey]);

  const monthLabel = new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = mondayFirst(new Date(year, month, 1).getDay());

  // Niet vóór de huidige maand navigeren.
  const atCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function statusFor(dateStr: string): "free" | "full" | "blocked" | "past" {
    if (dateStr < today) return "past";
    return availability[dateStr] ?? "free";
  }

  const canSubmit = Boolean(selected || noDatePreference);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !workshopId) return;
    setStatus("sending");
    setError("");
    const result = await createBooking({
      workshopId,
      datum: selected ?? undefined,
      naam,
      email,
      tel,
      aantalPersonen: Number(aantal) || 1,
      bericht,
      website,
    });
    if (result.ok) {
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("error");
      // Datum kan intussen bezet zijn: beschikbaarheid verversen.
      getAvailability(maandKey).then(setAvailability);
    }
  }

  // Pijltjestoetsen verplaatsen focus tussen de dagen (roving focus).
  function onGridKeyDown(e: React.KeyboardEvent) {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const delta = deltas[e.key];
    if (delta === undefined) return;
    const target = e.target as HTMLElement;
    const day = Number(target.dataset.day);
    if (!day) return;
    const next = day + delta;
    if (next < 1 || next > daysInMonth) return;
    e.preventDefault();
    const btn = gridRef.current?.querySelector<HTMLButtonElement>(
      `button[data-day="${next}"]`,
    );
    btn?.focus();
  }

  if (status === "done") {
    const chosen = workshops.find((w) => w.id === workshopId);
    return (
      <div className="border-y border-sage/30 py-14 text-center">
        <p className="font-display text-2xl tracking-[0.06em]">
          Aanvraag verstuurd
        </p>
        <p className="mx-auto mt-4 max-w-[48ch] text-base opacity-85">
          Dankjewel voor je aanvraag{chosen ? ` voor ${chosen.name}` : ""}. Je
          ontvangt een bevestiging per e-mail met een agenda-item. Ik neem
          contact met je op om de datum en tijd definitief af te stemmen.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* Kalender */}
      <div>
        {workshops.length > 1 && (
          <div className="mb-8">
            <p className="text-sm tracking-[0.14em] text-white/70 uppercase">
              Kies een workshop
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {workshops.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWorkshopId(w.id)}
                  aria-pressed={workshopId === w.id}
                  className={`rounded-full border px-5 py-2 text-base tracking-[0.03em] transition-colors ${
                    workshopId === w.id
                      ? "border-white bg-white text-wine"
                      : "border-white/30 text-white hover:border-white"
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={atCurrentMonth}
            aria-label="Vorige maand"
            className="cursor-pointer p-2 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <p className="font-display text-xl tracking-[0.06em] capitalize">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Volgende maand"
            className="cursor-pointer p-2 transition-opacity hover:opacity-70"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="pb-2 text-sm tracking-[0.1em] text-white/50 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        <div
          ref={gridRef}
          onKeyDown={onGridKeyDown}
          role="group"
          aria-label="Beschikbare datums"
          className="grid grid-cols-7 gap-1 text-center"
        >
          {Array.from({ length: leading }).map((_, i) => (
            <div key={`lead-${i}`} aria-hidden />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${maandKey}-${pad(day)}`;
            const st = statusFor(dateStr);
            const disabled = st !== "free";
            const isSelected = selected === dateStr;
            const label = new Intl.DateTimeFormat("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(new Date(year, month, day));

            return (
              <button
                key={day}
                type="button"
                data-day={day}
                disabled={disabled}
                aria-label={
                  disabled
                    ? `${label}, niet beschikbaar`
                    : `${label}, beschikbaar`
                }
                aria-pressed={isSelected}
                onClick={() => {
                  setSelected(dateStr);
                  setNoDatePreference(false);
                }}
                className={`aspect-square text-base tabular-nums transition-colors ${
                  isSelected
                    ? "bg-white text-wine"
                    : disabled
                      ? "cursor-not-allowed text-white/25 line-through"
                      : "cursor-pointer text-white hover:bg-white/10"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-base opacity-60">
          Doorgestreepte datums zijn al bezet of niet beschikbaar. Kies een vrije
          dag om je aanvraag te doen.
        </p>

        <button
          type="button"
          onClick={() => {
            setNoDatePreference(true);
            setSelected(null);
          }}
          aria-pressed={noDatePreference}
          className={`mt-4 cursor-pointer text-base underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70 ${
            noDatePreference ? "text-sage" : ""
          }`}
        >
          Ik heb nog geen voorkeursdatum, doe toch een aanvraag
        </button>
      </div>

      {/* Formulier op een witte adempauze-kaart (leesbaarheid van de velden) */}
      <div className="bg-white p-7 md:p-9">
        <h3 className="font-display text-2xl tracking-[0.06em]">
          {selected
            ? `Aanvraag voor ${new Intl.DateTimeFormat("nl-NL", {
                day: "numeric",
                month: "long",
              }).format(new Date(`${selected}T00:00:00`))}`
            : noDatePreference
              ? "Aanvraag zonder vaste datum"
              : "Kies een datum, of ga verder zonder"}
        </h3>

        <form onSubmit={handleSubmit} className="relative mt-8">
          <fieldset
            disabled={!canSubmit}
            className={`m-0 space-y-6 border-0 p-0 transition-opacity ${
              canSubmit ? "opacity-100" : "opacity-40"
            }`}
          >
            <Honeypot value={website} onChange={setWebsite} />
          <Field
            id="b-naam"
            name="naam"
            label="Naam"
            required
            value={naam}
            onChange={setNaam}
            autoComplete="name"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id="b-email"
              name="email"
              label="E-mail"
              type="email"
              required
              value={email}
              onChange={setEmail}
              autoComplete="email"
              inputMode="email"
            />
            <Field
              id="b-tel"
              name="tel"
              label="Telefoon"
              type="tel"
              required
              value={tel}
              onChange={setTel}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <Field
            id="b-aantal"
            name="aantalPersonen"
            label="Aantal personen"
            type="number"
            required
            value={aantal}
            onChange={setAantal}
            inputMode="numeric"
            min={1}
            max={50}
          />
          <TextAreaField
            id="b-bericht"
            name="bericht"
            label="Bericht (optioneel)"
            value={bericht}
            onChange={setBericht}
            rows={4}
          />

          <div aria-live="polite" className="min-h-[1.5rem]">
            {status === "error" && <p className="text-base text-wine">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || status === "sending"}
            className="inline-flex cursor-pointer items-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Versturen..." : "Aanvraag versturen"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
