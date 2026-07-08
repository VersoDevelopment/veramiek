import type { ReactNode } from "react";

/**
 * Gedeeld formulierveld in de galeriestijl: een klein getrackt label boven
 * een dun onderlijnd invoerveld (geen omkaderde box, geen schaduw). Gebruikt
 * door checkout, contact en workshopboeking.
 */

const fieldBase =
  "mt-2 w-full border-b border-wine/25 bg-transparent pb-2 text-base text-wine transition-colors placeholder:text-wine/40 focus:border-wine focus:outline-none";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm tracking-[0.14em] text-wine/70 uppercase"
    >
      {children}
      {required && (
        <span aria-hidden className="ml-1 text-sage">
          *
        </span>
      )}
    </label>
  );
}

type BaseProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  className?: string;
};

type InputFieldProps = BaseProps & {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  min?: number;
  max?: number;
};

export function Field({
  id,
  name,
  label,
  required,
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
  placeholder,
  min,
  max,
  className = "",
}: InputFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={fieldBase}
      />
    </div>
  );
}

type TextAreaFieldProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export function TextAreaField({
  id,
  name,
  label,
  required,
  value,
  onChange,
  rows = 5,
  placeholder,
  className = "",
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldBase} resize-none`}
      />
    </div>
  );
}

/**
 * Verborgen honeypot-veld tegen bots. Echte bezoekers zien of vullen dit
 * nooit; de server negeert inzendingen waarin het is ingevuld.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
