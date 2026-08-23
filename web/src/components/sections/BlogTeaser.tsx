import { BlogCarousel } from "@/components/ui/BlogCarousel";
import { RevealSection } from "@/components/ui/RevealSection";
import { getBlogs, type BlogPost } from "@/lib/api";
import { CAROUSEL_POST_COUNT } from "@/lib/content";

/**
 * Blogsectie op de homepage, tussen Collecties en Workshops: de carrousel op een
 * Deep Wine vlak. Dat wijnrood onderbreekt de reeks witte secties eromheen, net
 * als de vorige blogsectie deed.
 *
 * De carrousel toont de eerste drie artikelen; de API levert er meer.
 */
const FIRST_BLOG_META = "Het begin, 2025";

function homepagePosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    if (a.meta === FIRST_BLOG_META) return -1;
    if (b.meta === FIRST_BLOG_META) return 1;
    return 0;
  });
}

export async function BlogTeaser() {
  const posts = await getBlogs();

  /* Zonder artikelen geen sectie. Dat gebeurt als de API even niet bereikbaar
     is; een leeg wijnrood vlak op de homepage is dan slechter dan niets. */
  if (posts.length === 0) return null;

  return (
    <RevealSection
      id="blog"
      className="bg-wine px-5 py-24 text-white antialiased md:px-10 md:py-32"
    >
      <BlogCarousel
        posts={homepagePosts(posts).slice(0, CAROUSEL_POST_COUNT).map((post) => ({
          ...post,
          // Alleen posts met een geschreven artikel krijgen een link.
          href: post.body?.length ? `/blog/${post.slug}` : undefined,
        }))}
        tone="light"
      />
    </RevealSection>
  );
}
