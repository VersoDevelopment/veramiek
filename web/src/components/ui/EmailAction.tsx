"use client";

import { useState, type MouseEvent } from "react";

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
  const [copied, setCopied] = useState(false);
  const href = "mailto:" + email;
  const classes = (variant === "row" ? rowClasses : buttonClasses) + " " + className;

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) return;

    if (navigator.share) {
      event.preventDefault();
      try {
        await navigator.share({
          title: "E-mail Veramiek",
          text: email,
          url: href,
        });
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }
    }

    if (navigator.clipboard?.writeText) {
      event.preventDefault();
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <a href={href} onClick={handleClick} className={classes}>
      {variant === "row" && (
        <span
          aria-hidden
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-2xl leading-none text-sage"
        >
          @
        </span>
      )}
      <span className={variant === "row" ? "text-lg" : undefined}>
        {copied ? "E-mailadres gekopieerd" : label}
      </span>
    </a>
  );
}
