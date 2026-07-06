/**
 * Minimale "binnenkort"-pagina zodat navigatielinks niet op een 404 uitkomen.
 */
export function StubPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 pt-[72px] text-center">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <div aria-hidden className="mt-8 h-px w-10 bg-sage/70" />
      <p className="mt-8 max-w-[46ch] text-base opacity-85">{children}</p>
    </section>
  );
}
