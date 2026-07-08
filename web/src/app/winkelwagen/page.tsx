"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/cart/CartDrawer";
import { Field, Honeypot } from "@/components/ui/Field";
import { formatPrice, sendOrder, type OrderItem } from "@/lib/api";

type Status = "idle" | "sending" | "done" | "error";

export default function WinkelwagenPage() {
  const { items, total, setQty, remove, clear } = useCart();

  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [adres, setAdres] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("sending");
    setError("");

    const orderItems: OrderItem[] = items.map((i) => ({
      name: i.name,
      qty: i.qty,
      subtotal: formatPrice(i.price * i.qty),
    }));

    const result = await sendOrder({
      naam,
      email,
      tel,
      adres,
      items: orderItems,
      totaal: formatPrice(total),
      website,
    });

    if (result.ok) {
      clear();
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }

  // Bevestiging na een geslaagde bestelling.
  if (status === "done") {
    return (
      <section className="flex min-h-[70svh] flex-col items-center justify-center px-6 pt-40 pb-28 text-center">
        <h1 className="text-4xl md:text-5xl">Bedankt voor je bestelling</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />
        <p className="mt-8 max-w-[46ch] text-lg opacity-85">
          Je ontvangt zo een bevestiging per e-mail. Ik neem contact met je op
          over betaling en bezorging of ophalen. Tot snel!
        </p>
        <Link
          href="/collecties"
          className="mt-10 inline-flex rounded-full border border-white px-8 py-3 text-base tracking-[0.03em] transition-colors hover:bg-white hover:text-wine"
        >
          Verder kijken
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl">Winkelwagen</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

        {items.length === 0 ? (
          <div className="mt-16">
            <p className="text-lg opacity-80">Je winkelwagen is nog leeg.</p>
            <Link
              href="/collecties"
              className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-base tracking-[0.03em] text-wine transition-opacity hover:opacity-85"
            >
              Bekijk de collecties
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            {/* Regels */}
            <div>
              <ul className="divide-y divide-sage/30 border-y border-sage/30">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-5 py-6">
                    <Link
                      href={`/collecties/${item.id}`}
                      className="relative h-28 w-24 shrink-0 overflow-hidden bg-sage/10"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={`/collecties/${item.id}`}
                          className="font-display text-xl leading-tight tracking-[0.04em] transition-opacity hover:opacity-70"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label={`${item.name} verwijderen`}
                          className="cursor-pointer text-sm underline decoration-1 underline-offset-2 opacity-60 transition-opacity hover:opacity-100"
                        >
                          Verwijder
                        </button>
                      </div>
                      <p className="mt-1 text-base opacity-75">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-4 pt-4">
                        <QtyStepper
                          qty={item.qty}
                          onChange={(q) => setQty(item.id, q)}
                          label={item.name}
                          tone="light"
                        />
                        <span className="ml-auto text-lg">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between text-xl">
                <span className="opacity-75">Totaal</span>
                <span className="font-display tracking-[0.04em]">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-3 text-base opacity-60">
                Verzendkosten worden na je bestelling met je afgestemd.
              </p>
            </div>

            {/* Afrekenen: witte adempauze-kaart voor leesbaarheid van het formulier */}
            <div className="bg-white p-7 md:p-9 lg:sticky lg:top-28 lg:h-fit">
              <h2 className="font-display text-2xl tracking-[0.06em]">
                Je gegevens
              </h2>
              <p className="mt-3 text-base opacity-70">
                Je rekent nog niet online af. Ik bevestig je bestelling
                persoonlijk en stem betaling en bezorging met je af.
              </p>

              <form onSubmit={handleSubmit} className="relative mt-8 space-y-6">
                <Honeypot value={website} onChange={setWebsite} />
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
                <Field
                  id="tel"
                  name="tel"
                  label="Telefoon"
                  type="tel"
                  value={tel}
                  onChange={setTel}
                  autoComplete="tel"
                  inputMode="tel"
                />
                <Field
                  id="adres"
                  name="adres"
                  label="Adres (voor bezorging)"
                  value={adres}
                  onChange={setAdres}
                  autoComplete="street-address"
                />

                <div aria-live="polite" className="min-h-[1.5rem]">
                  {status === "error" && (
                    <p className="text-base text-wine">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-wine px-10 py-4 text-lg tracking-[0.03em] text-white transition-opacity duration-300 hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Versturen..." : "Bestelling plaatsen"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
