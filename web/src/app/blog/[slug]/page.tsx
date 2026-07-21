import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/ui/CtaButton";
import { RevealSection } from "@/components/ui/RevealSection";
import { findPost, publishedPosts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Veramiek`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <RevealSection className="px-6 pt-44 pb-28 md:pb-36">
      <article className="mx-auto max-w-[65ch]">
        <p className="text-base tracking-[0.22em] text-white/55 uppercase">
          {post.meta}
        </p>
        <h1 className="mt-4 text-4xl text-balance md:text-5xl">{post.title}</h1>
        <div aria-hidden className="mt-8 h-px w-12 bg-sage/70" />

        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            sizes="(min-width: 768px) 65ch, 100vw"
            className="object-cover"
            style={{ objectPosition: post.objectPosition ?? "center" }}
            priority
          />
        </div>

        <div className="mt-12 space-y-7 text-lg text-white/90">
          {post.body?.slice(0, 2).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        {/* Twee staande foto's naast elkaar, halverwege het artikel. */}
        {post.gallery?.length ? (
          <div className="mt-12 grid grid-cols-2 gap-5">
            {post.gallery.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 32ch, 50vw"
                  className="object-cover"
                  style={{ objectPosition: photo.objectPosition ?? "center" }}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-12 space-y-7 text-lg text-white/90">
          {post.body?.slice(2).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14">
          <CtaButton href="/blog" variant="lightOutline">
            Alle blogs
          </CtaButton>
        </div>
      </article>
    </RevealSection>
  );
}
