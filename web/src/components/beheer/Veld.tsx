import type { ReactNode } from "react";

/**
 * Formuliervelden voor het beheerscherm.
 *
 * Bewust niet de gedeelde Field-componenten van de site: die zijn getekend
 * voor de galeriestijl (dunne onderlijn, brede letterafstand, Gruppo op 19px).
 * Dat leest prettig bij drie velden op een contactpagina en slecht bij een
 * formulier van vijftien velden dat iemand wekelijks invult. Hier dus een
 * systeemletter, kleinere maat, een echte omkadering en een duidelijke
 * focusrand.
 */

const veldBasis =
  "w-full rounded-md border border-wine/20 bg-white px-3 py-2.5 text-[0.95rem] leading-normal text-wine placeholder:text-wine/35 focus:border-wine/50 focus:ring-2 focus:ring-sage focus:outline-none";

function Label({
  htmlFor,
  children,
  verplicht,
}: {
  htmlFor: string;
  children: ReactNode;
  verplicht?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.8rem] font-medium tracking-[0.02em] text-wine/70"
    >
      {children}
      {verplicht && (
        <span aria-hidden className="ml-1 text-wine/40">
          verplicht
        </span>
      )}
    </label>
  );
}

function Uitleg({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[0.8rem] text-wine/45">{children}</p>;
}

type BasisProps = {
  id: string;
  label: string;
  verplicht?: boolean;
  uitleg?: string;
  className?: string;
};

type VeldProps = BasisProps & {
  waarde: string;
  onChange: (waarde: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
};

export function Veld({
  id,
  label,
  verplicht,
  uitleg,
  waarde,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  className = "",
}: VeldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} verplicht={verplicht}>
        {label}
      </Label>
      <input
        id={id}
        name={id}
        type={type}
        value={waarde}
        required={verplicht}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${veldBasis}`}
      />
      {uitleg && <Uitleg>{uitleg}</Uitleg>}
    </div>
  );
}

type TekstvlakProps = BasisProps & {
  waarde: string;
  onChange: (waarde: string) => void;
  regels?: number;
  placeholder?: string;
};

export function Tekstvlak({
  id,
  label,
  verplicht,
  uitleg,
  waarde,
  onChange,
  regels = 4,
  placeholder,
  className = "",
}: TekstvlakProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} verplicht={verplicht}>
        {label}
      </Label>
      <textarea
        id={id}
        name={id}
        rows={regels}
        value={waarde}
        required={verplicht}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${veldBasis} resize-y`}
      />
      {uitleg && <Uitleg>{uitleg}</Uitleg>}
    </div>
  );
}

type KeuzeProps = BasisProps & {
  waarde: string;
  onChange: (waarde: string) => void;
  opties: readonly string[];
};

export function Keuze({
  id,
  label,
  uitleg,
  waarde,
  onChange,
  opties,
  className = "",
}: KeuzeProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        value={waarde}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${veldBasis}`}
      >
        {opties.map((optie) => (
          <option key={optie} value={optie}>
            {optie}
          </option>
        ))}
      </select>
      {uitleg && <Uitleg>{uitleg}</Uitleg>}
    </div>
  );
}

/** Knop in de beheerstijl: gevuld voor de hoofdactie, kaal voor de rest. */
export function Knop({
  children,
  soort = "kaal",
  className = "",
  ...rest
}: {
  children: ReactNode;
  soort?: "vol" | "kaal" | "gevaar";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const stijl =
    soort === "vol"
      ? "bg-wine text-white hover:bg-wine/90 disabled:opacity-50"
      : soort === "gevaar"
        ? "border border-wine/25 text-wine hover:bg-wine/5 disabled:opacity-50"
        : "text-wine/70 hover:bg-wine/5 hover:text-wine disabled:opacity-50";

  return (
    <button
      {...rest}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-[0.9rem] font-medium transition-colors disabled:cursor-not-allowed ${stijl} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Knop om een foto te kiezen.
 *
 * Een kale <input type="file"> toont browsertekst die je niet kunt aanpassen,
 * en die is in het Nederlands van Edge en Chrome gewoon Engels ("Choose file,
 * no file chosen"). Daarom het echte veld verstoppen en een label eroverheen:
 * een label activeert de input vanzelf, dus dit blijft met het toetsenbord en
 * met een schermlezer werken.
 */
export function FotoKiezer({
  id,
  label = "Foto kiezen",
  bezig,
  onKies,
  invoerRef,
}: {
  id: string;
  label?: string;
  bezig?: boolean;
  onKies: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invoerRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center rounded-md border border-wine/25 px-4 py-2.5 text-[0.9rem] font-medium text-wine transition-colors hover:bg-wine/5 focus-within:ring-2 focus-within:ring-sage"
      >
        {label}
        <input
          ref={invoerRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onKies}
          className="sr-only"
        />
      </label>
      {bezig && (
        <span className="text-[0.9rem] text-wine/60">Bezig met uploaden...</span>
      )}
    </div>
  );
}

/** Groepeert velden die bij elkaar horen, met een kopje erboven. */
export function Blok({
  titel,
  uitleg,
  children,
}: {
  titel: string;
  uitleg?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-wine/12 bg-white p-5 sm:p-6">
      <h3 className="text-[0.95rem] font-semibold text-wine">{titel}</h3>
      {uitleg && <p className="mt-1 text-[0.85rem] text-wine/50">{uitleg}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
