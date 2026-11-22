"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const CARD_COLORS = ["#dcaeb9", "#899ccf", "#f0b75f", "#88b8a2", "#d77953"];

type Year = {
  _id: string;
  title: string;
  gardenName?: string;
  teacherName?: string;
  gardenImage?: string;
  gardenDescription?: string;
};

export default function YearCardsMeplace({
  years,
  artworkCounts,
}: {
  years: Year[];
  artworkCounts: Record<string, number>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className="flex flex-row gap-3 h-[420px]"
      onMouseLeave={() => setOpenIndex(null)}
    >
      {years.map((year, i) => {
        const color = CARD_COLORS[i % CARD_COLORS.length];
        const isOpen = openIndex === i;
        const count = artworkCounts[year._id] ?? 0;

        return (
          <div
            key={year._id}
            onMouseEnter={() => setOpenIndex(i)}
            className="relative rounded-3xl overflow-hidden cursor-pointer"
            style={{
              flex: isOpen ? "4 1 0%" : "1 1 0%",
              transition: "flex 0.5s ease",
              minWidth: 0,
            }}
          >
            {/* Background image or color */}
            {year.gardenImage ? (
              <Image
                src={year.gardenImage}
                alt={year.title}
                fill
                className="object-cover"
                sizes="400px"
              />
            ) : (
              <div className="absolute inset-0" style={{ backgroundColor: `${color}40` }} />
            )}

            {/* Overlay on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 50%)",
                opacity: isOpen ? 1 : 0,
              }}
            />

            {/* Always-visible bottom label */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 py-4"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-end justify-between">
                <div className="min-w-0">
                  <p className="text-white/70 text-xs font-bold mb-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-white font-black text-lg leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {year.gardenName || year.title}
                  </h3>
                </div>
                <span className="text-white text-xl ml-3 flex-shrink-0">{isOpen ? "↙" : "↗"}</span>
              </div>

              {/* Expanded content inside label */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: isOpen ? "160px" : "0px", opacity: isOpen ? 1 : 0 }}
              >
                <div className="pt-3 flex flex-col gap-1">
                  {year.teacherName && (
                    <p className="text-white/80 text-sm font-medium">גננת: {year.teacherName}</p>
                  )}
                  {year.gardenDescription && (
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                      {year.gardenDescription}
                    </p>
                  )}
                  <p className="text-white/60 text-xs">{count} יצירות</p>
                  <Link
                    href={`/years/${year._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="self-start mt-1 bg-white text-ink text-xs font-black px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
                  >
                    לגלריה ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
