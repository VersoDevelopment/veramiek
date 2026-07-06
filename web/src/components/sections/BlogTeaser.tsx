import Link from "next/link";
import { BlogTile } from "@/components/ui/BlogTile";
import { RevealSection } from "@/components/ui/RevealSection";
import { blogPosts } from "@/lib/content";

/**
 * Asymmetrisch, redactioneel blograster: handmatig geplaatste tegels met
 * verschillende formaten en verticale offsets, geen uniforme grid.
 */
export function BlogTeaser() {
  return (
    <RevealSection id="blog" className="bg-white px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 md:mb-20">
          <h2 className="text-3xl md:text-4xl">Mijn blog</h2>
          <Link
            href="/blog"
            className="border-b border-wine/30 pb-1 text-base tracking-[0.03em] transition-colors hover:border-wine"
          >
            Bekijk alle berichten
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-x-3 gap-y-10 md:gap-y-16">
          {blogPosts.map((post) => (
            <BlogTile key={post.title} post={post} />
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
