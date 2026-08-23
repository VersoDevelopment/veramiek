import { BlogCarousel } from "@/components/ui/BlogCarousel";
import { getBlogs } from "@/lib/api";
import { CAROUSEL_POST_COUNT } from "@/lib/content";

/**
 * Speelveld voor de blogcarrousel, naast de echte sectie (BlogTeaser).
 * Leest dezelfde artikelen uit de API, zodat preview en site niet uit elkaar
 * lopen. De wijnrode variant is degene die op de homepage staat.
 */
export default async function PreviewBlogCarouselPage() {
  const items = (await getBlogs()).slice(0, CAROUSEL_POST_COUNT).map((post) => ({
    ...post,
    href: post.body?.length ? `/blog/${post.slug}` : undefined,
  }));

  return (
    <main className="pt-[92px]">
      <section className="bg-white px-5 py-24 md:px-10 md:py-32">
        <p className="mx-auto mb-16 max-w-7xl text-base tracking-[0.22em] uppercase opacity-45">
          Variant 1, op wit
        </p>
        <BlogCarousel posts={items} tone="dark" />
      </section>

      <section className="bg-wine px-5 py-24 text-white antialiased md:px-10 md:py-32">
        <p className="mx-auto mb-16 max-w-7xl text-base tracking-[0.22em] uppercase opacity-45">
          Variant 2, op Deep Wine (staat live op de homepage)
        </p>
        <BlogCarousel posts={items} tone="light" />
      </section>
    </main>
  );
}
