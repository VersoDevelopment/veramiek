"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { BlogPost } from "@/lib/content";
import { useTypewriter } from "@/lib/useTypewriter";

/**
 * Redactionele blogtegel: bij hover/focus verschijnt de excerpt als
 * typemachine-tekst over het beeld. Bij reduced motion direct volledig.
 */
export function BlogTile({ post }: { post: BlogPost }) {
  const [active, setActive] = useState(false);
  const typedExcerpt = useTypewriter(post.excerpt, active);

  return (
    <Link
      href="/blog"
      className={`group block ${post.layoutClass}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className="mb-3 block text-sm tracking-[0.22em] text-wine/55 uppercase">
        {post.meta}
      </span>
      <div className={`relative overflow-hidden ${post.aspectClass}`}>
        <Image
          src={post.image}
          alt={post.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div
          className={`absolute inset-0 flex items-end bg-wine/70 p-6 transition-opacity duration-300 md:p-8 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="max-w-[38ch] text-sm text-white" aria-hidden>
            {typedExcerpt}
            {active && typedExcerpt.length < post.excerpt.length && (
              <span className="opacity-70">|</span>
            )}
          </p>
        </div>
      </div>
      <h3 className="mt-4 text-xl text-balance">{post.title}</h3>
      <span className="sr-only">{post.excerpt}</span>
    </Link>
  );
}
