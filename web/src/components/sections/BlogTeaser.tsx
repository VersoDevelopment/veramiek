import Link from "next/link";
import { BlogTile } from "@/components/ui/BlogTile";
import { RevealSection } from "@/components/ui/RevealSection";
import { blogPosts } from "@/lib/content";

/**
 * Asymmetrisch, redactioneel blograster: handmatig geplaatste tegels met
 * verschillende formaten en verticale offsets, geen uniforme grid.
 * Deep Wine achtergrond; de tegels zelf zijn 20% kleiner dan de collectiefoto's.
 */
export function BlogTeaser() {
  return (
    <RevealSection id="blog" className="bg-wine px-5 py-24 text-white antialiased md:px-10 md:py-32">
      <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 md:mb-20">
        <h2 className="text-3xl md:text-4xl">Mijn blogs</h2>
        <Link
          href="/blog"
          className="border-b border-white/30 pb-1 text-base tracking-[0.03em] transition-colors hover:border-white"
        >
          Bekijk alle blogs
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-6 md:gap-y-12">
        {blogPosts.map((post) => (
          <BlogTile key={post.title} post={post} />
        ))}
      </div>
    </RevealSection>
  );
}
