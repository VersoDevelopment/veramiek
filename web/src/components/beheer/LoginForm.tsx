"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { BeheerFout, login } from "@/lib/beheer";

type Props = {
  onIngelogd: () => void;
};

/**
 * Wachtwoord plus de zescijferige code uit de authenticator-app. De API
 * accepteert alleen de combinatie, dus beide velden zijn verplicht.
 */
export function LoginForm({ onIngelogd }: Props) {
  const [wachtwoord, setWachtwoord] = useState("");
  const [code, setCode] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFout("");
    try {
      await login(wachtwoord, code);
      onIngelogd();
    } catch (error) {
      setFout(
        error instanceof BeheerFout
          ? error.message
          : "Inloggen mislukt. Probeer het nog eens.",
      );
      setCode("");
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-4xl text-wine">Beheer</h1>
      <p className="mt-3 text-base text-wine/70">
        Log in om producten en teksten aan te passen.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <Field
          id="beheer-wachtwoord"
          name="wachtwoord"
          label="Wachtwoord"
          type="password"
          required
          value={wachtwoord}
          onChange={setWachtwoord}
          autoComplete="current-password"
        />
        <Field
          id="beheer-code"
          name="code"
          label="Code uit je app"
          required
          value={code}
          onChange={setCode}
          autoComplete="one-time-code"
          inputMode="numeric"
          placeholder="123456"
        />

        <div aria-live="polite" className="min-h-[1.5rem]">
          {fout && <p className="text-base text-wine">{fout}</p>}
        </div>

        <button
          type="submit"
          disabled={bezig}
          className="inline-flex cursor-pointer items-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {bezig ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
