import type { Metadata } from "next";
import Image from "next/image";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { getWorkshops } from "@/lib/api";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Kom zelf aan de draaischijf of boek een keramiekworkshop op locatie. Kleine groepen, alle aandacht, en je eigen handgemaakte stuk mee naar huis.",
  alternates: { canonical: "/workshops" },
};

export default async function WorkshopsPage() {
  const workshops = await getWorkshops();

  return (
    <div>
      {/* Intro */}
      <section className="px-5 pt-40 pb-16 md:px-10 md:pb-24">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl">Workshops</h1>
          <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-sage/70" />
          <p className="mx-auto mt-8 max-w-[52ch] text-lg text-white/90">
            Ervaar zelf hoe klei onder je handen vorm krijgt. In een kleine
            groep, met alle tijd en aandacht, en je eigen gemaakte stuk mee naar
            huis.
          </p>
        </header>
      </section>

      {/* Workshoptypes, bewust ongelijk uitgelijnd */}
      {workshops.length > 0 && (
        <section className="px-5 pb-8 md:px-10 md:pb-16">
          <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
            {workshops.map((w, i) => (
              <article
                key={w.id}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sage/10 md:aspect-[5/6]">
                  {w.images[0] && (
                    <Image
                      src={w.images[0]}
                      alt={w.name}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl">{w.name}</h2>
                  <div aria-hidden className="mt-6 h-px w-12 bg-sage/70" />
                  <p className="mt-8 max-w-[46ch] text-lg text-white/90">
                    {w.desc}
                  </p>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-base">
                    {w.duration && (
                      <div>
                        <dt className="text-sm tracking-[0.14em] text-white/55 uppercase">
                          Duur
                        </dt>
                        <dd className="mt-1">{w.duration}</dd>
                      </div>
                    )}
                    {w.groupSize && (
                      <div>
                        <dt className="text-sm tracking-[0.14em] text-white/55 uppercase">
                          Groep
                        </dt>
                        <dd className="mt-1">{w.groupSize}</dd>
                      </div>
                    )}
                    {w.price && (
                      <div>
                        <dt className="text-sm tracking-[0.14em] text-white/55 uppercase">
                          Prijs
                        </dt>
                        <dd className="mt-1">{w.price}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Boeking */}
      <section id="boeken" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <header className="mb-14 text-center md:mb-20">
            <h2 className="text-3xl md:text-4xl">Doe een aanvraag</h2>
            <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-sage/70" />
            <p className="mx-auto mt-8 max-w-[48ch] text-base opacity-85">
              Kies een datum die jou schikt, of doe je aanvraag zonder vaste
              datum. Ik bevestig de datum en tijd daarna persoonlijk met je.
            </p>
          </header>

          {workshops.length === 0 ? (
            <p className="py-10 text-center text-base opacity-70">
              De workshopagenda wordt op dit moment bijgewerkt. Kom snel terug of
              stuur me een bericht.
            </p>
          ) : (
            <BookingCalendar workshops={workshops} />
          )}
        </div>
      </section>
    </div>
  );
}
