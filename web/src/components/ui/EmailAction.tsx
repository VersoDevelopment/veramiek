"use client";

type EmailActionProps = {
  email: string;
  label?: string;
  variant?: "button" | "row";
  className?: string;
};

const buttonClasses =
  "inline-flex items-center gap-2 rounded-full border border-white px-8 py-3 text-base tracking-[0.03em] whitespace-nowrap text-white antialiased transition-[opacity,background-color,color] duration-300 hover:bg-white hover:text-wine active:scale-[0.98]";
const rowClasses = "flex items-center gap-4 transition-opacity hover:opacity-70";

export function EmailAction({
  email,
  label = "E-mail",
  variant = "button",
  className = "",
}: EmailActionProps) {
  const href = "mailto:" + email;
  const classes = (variant === "row" ? rowClasses : buttonClasses) + " " + className;

  return (
    <a href={href} className={classes}>
      {variant === "row" && (
        <span
          aria-hidden
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-2xl leading-none text-sage"
        >
          @
        </span>
      )}
      <span className={variant === "row" ? "text-lg" : undefined}>{label}</span>
    </a>
  );
}
