import { BlogCarousel } from "@/components/ui/BlogCarousel";
import { RevealSection } from "@/components/ui/RevealSection";
import { blogPosts, CAROUSEL_POST_COUNT } from "@/lib/content";

/**
 * Blogsectie op de homepage, tussen Collecties en Workshops: de carrousel op een
 * Deep Wine vlak. Dat wijnrood onderbreekt de reeks witte secties eromheen, net
 * als de vorige blogsectie deed.
 *
 * De carrousel toont de eerste drie posts; blogPosts zelf bevat er meer.
 */
const FIRST_BLOG_META = "Het begin, 2025";

function homepagePosts() {
  return [...blogPosts].sort((a, b) => {
    if (a.meta === FIRST_BLOG_META) return -1;
    if (b.meta === FIRST_BLOG_META) return 1;
    return 0;
  });
}

export function BlogTeaser() {
  return (
    <RevealSection
      id="blog"
      className="bg-wine px-5 py-24 text-white antialiased md:px-10 md:py-32"
    >
      <BlogCarousel
        posts={homepagePosts().slice(0, CAROUSEL_POST_COUNT).map((post) => ({
          ...post,
          // Alleen posts met een geschreven artikel krijgen een link.
          href: post.body?.length ? `/blog/${post.slug}` : undefined,
        }))}
        tone="light"
      />
    </RevealSection>
  );
}
