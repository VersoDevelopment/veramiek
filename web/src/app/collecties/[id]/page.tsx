import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice, getProduct, normalizeCategory } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product | Veramiek" };
  return {
    title: `${product.name} | Veramiek`,
    description: product.desc || undefined,
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const categorie = normalizeCategory(product.category);

  return (
    <article className="bg-white px-5 pt-40 pb-28 md:px-10 md:pb-36">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-10 text-base tracking-[0.03em] opacity-70">
          <Link href="/collecties" className="transition-opacity hover:opacity-100">
            Collecties
          </Link>
          <span aria-hidden className="mx-2 text-sage">
            /
          </span>
          <span>{product.name}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="md:pt-6">
            <p className="text-base tracking-[0.22em] text-wine/55 uppercase">
              {categorie}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl">{product.name}</h1>
            <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

            <p className="mt-8 font-display text-3xl tracking-[0.04em]">
              {formatPrice(product.price)}
            </p>

            {product.desc && (
              <p className="mt-8 max-w-[46ch] text-lg text-wine/90">
                {product.desc}
              </p>
            )}

            <div className="mt-12">
              <AddToCartButton product={product} />
            </div>

            <p className="mt-10 max-w-[46ch] text-base opacity-70">
              Elk stuk is met de hand gemaakt, kleine verschillen in vorm, kleur
              en glazuur zijn daar het bewijs van. Vragen over dit stuk of een
              maatwerkwens? Neem gerust{" "}
              <Link
                href="/contact"
                className="underline decoration-sage decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              >
                contact
              </Link>{" "}
              op.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
