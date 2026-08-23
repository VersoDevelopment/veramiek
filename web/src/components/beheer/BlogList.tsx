"use client";

import Image from "next/image";
import type { BlogPost } from "@/lib/api";
import { Knop } from "./Veld";

type Props = {
  blogs: BlogPost[];
  bezigId: string | null;
  onBewerk: (blog: BlogPost) => void;
  onVerwijder: (blog: BlogPost) => void;
};

/** Toont in een oogopslag of een artikel af is en of het op de site staat. */
function staat(blog: BlogPost): string {
  const alinea = blog.body?.length ?? 0;
  if (!blog.published) return "verborgen";
  if (alinea === 0) return "nog geen tekst";
  return `${alinea} ${alinea === 1 ? "alinea" : "alinea's"}`;
}

function datum(blog: BlogPost): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(blog.datePublished ?? "");
  return m ? ` · ${m[3]}/${m[2]}/${m[1]}` : "";
}

export function BlogList({ blogs, bezigId, onBewerk, onVerwijder }: Props) {
  if (blogs.length === 0) {
    return (
      <p className="py-10 text-[0.95rem] text-wine/60">
        Er zijn nog geen artikelen. Begin er een met Nieuw artikel.
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-lg border border-wine/12 bg-white">
      {blogs.map((blog) => (
        <li
          key={blog.id}
          className="flex items-center gap-4 border-b border-wine/8 px-4 py-3 last:border-b-0"
        >
          {blog.image ? (
            <Image
              src={blog.image}
              alt=""
              width={64}
              height={44}
              unoptimized
              className="h-11 w-16 shrink-0 rounded object-cover"
            />
          ) : (
            <div className="h-11 w-16 shrink-0 rounded bg-wine/8" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.95rem] text-wine">{blog.title}</p>
            <p className="text-[0.85rem] text-wine/50">
              {staat(blog)}
              {datum(blog)}
            </p>
          </div>

          <Knop type="button" onClick={() => onBewerk(blog)}>
            Bewerk
          </Knop>
          <Knop
            type="button"
            onClick={() => onVerwijder(blog)}
            disabled={bezigId === blog.id}
          >
            {bezigId === blog.id ? "Bezig..." : "Verwijder"}
          </Knop>
        </li>
      ))}
    </ul>
  );
}
