import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  /**
   * - primary: Deep Wine vulling op witte achtergrond
   * - outline: Deep Wine rand, transparant
   * - light: witte vulling, voor op Deep Wine-vlakken
   * - lightOutline: witte rand, voor op Deep Wine-vlakken of foto's
   */
  variant?: "primary" | "outline" | "light" | "lightOutline";
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
};

const variantClasses: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary: "bg-wine text-white hover:opacity-85",
  outline: "border border-wine text-wine hover:bg-wine hover:text-white",
  light: "bg-white text-wine hover:opacity-85",
  lightOutline: "border border-white text-white hover:bg-white hover:text-wine",
};

const sizeClasses: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  md: "px-8 py-3 text-base",
  lg: "px-10 py-4 text-lg",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: CtaButtonProps) {
  const classes = `inline-block rounded-full tracking-[0.03em] whitespace-nowrap antialiased transition-[opacity,background-color,color] duration-300 active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
