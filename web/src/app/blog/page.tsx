import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealSection } from "@/components/ui/RevealSection";
import { getBlogs, metArtikel } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Verhalen uit het atelier: hoe een cursus keramiek in september 2025 uitgroeide tot Veramiek.",
  alternates: { canonical: "/blog" },
};

/**
 * Overzicht van de blogs. Toont alleen artikelen met een geschreven tekst; de
 * aankondigingen zonder tekst blijven hier dus buiten. De artikelen komen live
 * uit de API, zodat een nieuw stuk uit het beheerscherm er meteen staat.
 */
export default async function BlogIndexPage() {
  const posts = metArtikel(await getBlogs());

  return (
    <RevealSection className="px-6 pt-44 pb-28 md:pb-36">
      {/*
       * Twee kolommen in plaats van onder elkaar. De container is daarvoor
       * verbreed van 70ch naar max-w-7xl, zodat elke kaart ongeveer even breed
       * blijft als in de vorige, gestapelde versie.
       */}
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl">Blogs</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

        <ul className="mt-16 grid gap-16 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(min-width: 768px) 38rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: post.objectPosition ?? "center" }}
                  />
                </div>
                <p className="mt-8 text-base tracking-[0.22em] text-white/55 uppercase">
                  {post.meta}
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl">{post.title}</h2>
                <p className="mt-6 text-lg text-white/85">{post.excerpt}</p>
                <span className="mt-6 inline-block text-base tracking-[0.03em] underline underline-offset-8 opacity-85 transition-colors group-hover:text-sage group-hover:opacity-100">
                  Lees verder
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </RevealSection>
  );
}
