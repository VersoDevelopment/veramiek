"use client";

import { useState } from "react";
import { Field, TextAreaField, Honeypot } from "@/components/ui/Field";
import { sendContact } from "@/lib/api";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Toegankelijk contactformulier (naam, e-mail, onderwerp, bericht) dat via de
 * API (/send-contact) een bericht naar Vera + een bevestiging naar de
 * bezoeker stuurt. Status wordt in een aria-live-regio gemeld.
 */
export function ContactForm() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [bericht, setBericht] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const result = await sendContact({
      naam,
      email,
      onderwerp,
      bericht,
      website,
    });

    if (result.ok) {
      setNaam("");
      setEmail("");
      setOnderwerp("");
      setBericht("");
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border-y border-sage/30 py-14 text-center">
        <p className="font-display text-2xl tracking-[0.06em]">
          Bericht verstuurd
        </p>
        <p className="mt-4 text-base opacity-80">
          Dankjewel, ik heb je bericht ontvangen en reageer zo snel mogelijk,
          doorgaans binnen 1 à 2 werkdagen.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 cursor-pointer text-base underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <Honeypot value={website} onChange={setWebsite} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="naam"
          name="naam"
          label="Naam"
          required
          value={naam}
          onChange={setNaam}
          autoComplete="name"
        />
        <Field
          id="email"
          name="email"
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={setEmail}
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <Field
        id="onderwerp"
        name="onderwerp"
        label="Onderwerp"
        value={onderwerp}
        onChange={setOnderwerp}
      />
      <TextAreaField
        id="bericht"
        name="bericht"
        label="Bericht"
        required
        value={bericht}
        onChange={setBericht}
        rows={6}
      />

      <div aria-live="polite" className="min-h-[1.5rem]">
        {status === "error" && <p className="text-base text-wine">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex cursor-pointer items-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Versturen..." : "Verstuur bericht"}
      </button>
    </form>
  );
}
