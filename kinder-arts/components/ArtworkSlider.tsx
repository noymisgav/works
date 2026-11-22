"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";

const ROTATIONS = [-3, 1.5, -1, 2.5, -2, 1, -1.5, 2, -2.5, 1.5];


export default function ArtworkSlider({ artworks }: { artworks: Artwork[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    ref.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-md items-center justify-center hover:bg-teal transition-all -mr-4 text-lg font-black text-ink"
        aria-label="הבא"
      >
        ‹
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-md items-center justify-center hover:bg-teal transition-all -ml-4 text-lg font-black text-ink"
        aria-label="הקודם"
      >
        ›
      </button>

      {/* Track */}
      <div
        ref={ref}
        className="flex gap-8 overflow-x-auto scroll-smooth py-8 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {artworks.map((art, i) => {
          const rotation = ROTATIONS[i % ROTATIONS.length];
          const formattedDate = art.creationDate
            ? new Date(art.creationDate).toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
              })
            : null;

          return (
            <Link
              key={art._id}
              href={`/artworks/${art._id}`}
              className="group shrink-0 block"
              style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s" }}
            >
              <div
                className="bg-card transition-all duration-300 p-4 pb-6 w-64 rounded-lg doodle-border-card"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)", fontFamily: "var(--font-heebo)" }}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-border/20 mb-4 rounded-sm">
                  {art.artworkImage ? (
                    <Image
                      src={art.artworkImage}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="256px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">🎨</div>
                  )}
                </div>

                {/* Polaroid text */}
                <p className="font-bold text-ink text-sm leading-snug line-clamp-1 text-center">
                  {art.title}
                </p>
                {art.medium && (
                  <p className="text-xs text-ink-light text-center mt-0.5 line-clamp-1">
                    {art.medium}
                  </p>
                )}
                {formattedDate && (
                  <p className="text-xs text-ink-light/60 text-center mt-1">
                    {formattedDate}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
