type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M16.6 5.82c-.7-.76-1.09-1.75-1.09-2.82h-3.07v13.44a2.6 2.6 0 1 1-1.85-2.49V10.8a5.66 5.66 0 1 0 4.92 5.62V9.9a6.9 6.9 0 0 0 4.09 1.33V8.16a3.98 3.98 0 0 1-3-2.34z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12.03 2.5A9.48 9.48 0 0 0 2.55 12a9.36 9.36 0 0 0 1.27 4.72L2.5 21.5l4.92-1.28a9.5 9.5 0 0 0 4.6 1.18h.01a9.48 9.48 0 0 0 9.47-9.45 9.4 9.4 0 0 0-2.78-6.7 9.44 9.44 0 0 0-6.69-2.75zm0 17.32h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.92.76.78-2.84-.19-.29a7.86 7.86 0 0 1-1.2-4.18 7.9 7.9 0 1 1 7.85 7.82z" />
      <path d="M16.4 14.15c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94-.28.18-.52.06a6.44 6.44 0 0 1-1.9-1.17 7.1 7.1 0 0 1-1.32-1.64c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42a1.6 1.6 0 0 0 .24-.4.44.44 0 0 0 0-.42c-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.32.98 2.48s1.7 2.59 4.11 3.63a13.9 13.9 0 0 0 1.37.5 3.3 3.3 0 0 0 1.51.1c.46-.07 1.42-.58 1.62-1.14s.2-1.04.14-1.14-.22-.16-.46-.28z" />
    </svg>
  );
}
