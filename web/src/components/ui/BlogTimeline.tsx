"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/api";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const WAVE_VIEWBOX_WIDTH = 1000;
const WAVE_PATH_D =
  "M0,60 C120,10 180,10 300,60 C420,110 480,110 600,60 C720,10 780,10 900,60 C950,85 980,85 1000,70";
/**
 * Posities (0-1) langs het pad waar de 5 knopen op geplaatst worden. Blijft
 * uit de buurt van de randen (0/1), anders steekt de 240px-brede label-full
 * van de buitenste knopen buiten de viewport op smallere breedtes.
 */
const FRACTIONS = [0.13, 0.315, 0.5, 0.685, 0.87];
/** Losjes verspreide eindposities rond het midden (px) voor de galerijstand. */
const SCATTER_OFFSETS = [
  { x: -430, y: -40 },
  { x: -190, y: 70 },
  { x: 0, y: -90 },
  { x: 200, y: 60 },
  { x: 430, y: -30 },
];

type NodePos = { leftPct: number; topPx: number };
type Phase = "idle" | "converging" | "scattered";

/**
 * Golvende blog-tijdlijn: ronde foto-stippen op een SVG-golflijn, bij
 * hover/klik groeien ze uit tot het volledige beeld (boven/onder de lijn,
 * om en om), met de titel/tekst aan de andere kant. Eén knoop staat altijd
 * "featured" (standaard de eerste, daarna de laatst-gehoverde). De knop
 * "Bekijk alle blogs" schakelt naar een galerijstand: alle foto's
 * verzamelen zich eerst in het midden en waaieren dan los uit elkaar.
 */
export function BlogTimeline({ posts }: { posts: BlogPost[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [positions, setPositions] = useState<NodePos[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGallery, setIsGallery] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scatterVars, setScatterVars] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setPositions(
      FRACTIONS.map((f) => {
        const p = path.getPointAtLength(f * len);
        return { leftPct: (p.x / WAVE_VIEWBOX_WIDTH) * 100, topPx: p.y - 60 };
      }),
    );
  }, []);

  function handleMouseEnter(i: number) {
    if (!isGallery) setActiveIndex(i);
  }

  function handleMouseLeave(i: number) {
    if (isGallery) return;
    setFeaturedIndex(i);
    setActiveIndex(i);
  }

  function openGallery() {
    if (!wrapRef.current || positions.length === 0) return;
    const wrapWidth = wrapRef.current.getBoundingClientRect().width;
    const cx = wrapWidth / 2;

    setScatterVars(
      positions.map((pos, i) => {
        const nodeLeftPx = (pos.leftPct / 100) * wrapWidth;
        const toCenter = cx - nodeLeftPx;
        return {
          "--bt-gx": `${toCenter}px`,
          "--bt-gy": `${-pos.topPx}px`,
          "--bt-sx": `${SCATTER_OFFSETS[i].x + toCenter}px`,
          "--bt-sy": `${SCATTER_OFFSETS[i].y - pos.topPx}px`,
          "--bt-sd": `${i * 90}ms`,
        };
      }),
    );

    setIsGallery(true);
    setActiveIndex(-1);
    setPhase(prefersReduced ? "scattered" : "converging");
    if (!prefersReduced) {
      window.setTimeout(() => setPhase("scattered"), 850);
    }
  }

  function closeGallery() {
    setIsGallery(false);
    setPhase("idle");
    setActiveIndex(featuredIndex);
  }

  return (
    <div className={prefersReduced ? "bt-reduced-motion" : ""}>
      <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 md:mb-20">
        <h2 className="text-3xl md:text-4xl">Mijn blogs</h2>
        <button
          type="button"
          onClick={isGallery ? closeGallery : openGallery}
          className="inline-flex items-center gap-2 rounded-full border border-white px-8 py-3 text-base tracking-[0.03em] whitespace-nowrap text-white antialiased transition-[opacity,background-color,color] duration-300 hover:bg-white hover:text-wine active:scale-[0.98]"
        >
          {isGallery ? "Timeline" : "Bekijk alle blogs"}
        </button>
      </div>

      <div
        ref={wrapRef}
        className={`relative h-[520px] md:h-[880px] ${isGallery ? "bt-gallery-mode" : ""}`}
      >
        <svg
          className="bt-wave-svg pointer-events-none absolute top-[-60px] left-0 h-[120px] w-full overflow-visible"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={WAVE_PATH_D}
            fill="none"
            stroke="rgba(255,255,255,.22)"
            strokeWidth={1}
          />
        </svg>

        {positions.length === posts.length &&
          posts.map((post, i) => {
            const isNodeActive = i === activeIndex;
            const nodeClasses = [
              "bt-node",
              i % 2 === 0 ? "bt-node--above" : "bt-node--below",
              isNodeActive ? "is-active" : "",
              phase === "converging" ? "is-converging" : "",
              phase === "scattered" ? "is-scattered" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={post.title}
                className={nodeClasses}
                style={{
                  left: `${positions[i].leftPct}%`,
                  top: `${positions[i].topPx}px`,
                  ...(scatterVars[i] ?? {}),
                }}
              >
                <div
                  className="bt-node-hit"
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                />

                <div className={`bt-thumb${post.tinted ? " tinted" : ""}`}>
                  <Image src={post.image} alt="" fill sizes="56px" className="object-cover" />
                </div>

                <div className={`bt-photo-full${post.tinted ? " tinted" : ""}`}>
                  <Image src={post.image} alt={post.alt} fill sizes="190px" className="object-cover" />
                </div>

                <span className="bt-label-mini">{post.title}</span>

                <div className="bt-label-full">
                  <span className="bt-meta">{post.meta}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>

                <Link href="/blog" className={`bt-gallery-photo${post.tinted ? " tinted" : ""}`}>
                  <Image src={post.image} alt={post.alt} fill sizes="150px" className="object-cover" />
                </Link>
                <span className="bt-gallery-title">{post.title}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
