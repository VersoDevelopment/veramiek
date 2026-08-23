"use client";

import { useState } from "react";
import { BeheerFout, login } from "@/lib/beheer";
import { Knop, Veld } from "./Veld";

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
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-wine">Beheer</h1>
        <p className="mt-2 text-[0.95rem] text-wine/60">
          Log in om producten, blogs en teksten aan te passen.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-lg border border-wine/12 bg-white p-6"
        >
          <Veld
            id="beheer-wachtwoord"
            label="Wachtwoord"
            type="password"
            verplicht
            waarde={wachtwoord}
            onChange={setWachtwoord}
            autoComplete="current-password"
          />
          <Veld
            id="beheer-code"
            label="Code uit je app"
            verplicht
            waarde={code}
            onChange={setCode}
            autoComplete="one-time-code"
            inputMode="numeric"
            placeholder="123456"
          />

          <div aria-live="polite">
            {fout && (
              <p className="rounded-md bg-wine/5 px-3 py-2 text-[0.9rem] text-wine">
                {fout}
              </p>
            )}
          </div>

          <Knop type="submit" soort="vol" disabled={bezig} className="w-full">
            {bezig ? "Bezig..." : "Inloggen"}
          </Knop>
        </form>
      </div>
    </div>
  );
}
