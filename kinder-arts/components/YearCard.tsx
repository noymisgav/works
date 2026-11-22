"use client";

import Link from "next/link";
import Image from "next/image";

const TITLE_COLORS = ["#dcaeb9", "#f0b75f", "#88b8a2"];

export default function YearCard({
  year,
  index,
  artworkCount,
  isCurrent,
}: {
  year: { _id: string; title: string; gardenName?: string; teacherName?: string; gardenImage?: string; gardenDescription?: string };
  index: number;
  artworkCount: number;
  isCurrent?: boolean;
}) {
  const titleColor = TITLE_COLORS[index % TITLE_COLORS.length];

  return (
    <Link
      href={`/years/${year._id}`}
      className="group relative flex flex-col doodle-border-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl sm:h-[420px]"
      data-garden={year.gardenName || year.title}
      style={{}}
    >
      {isCurrent && (
        <div className="absolute -top-4 right-4 z-10 flex items-center gap-1.5 bg-ink text-cream text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          <span>📍</span>
          <span>אתה נמצא כאן</span>
        </div>
      )}

      {/* Image — shrinks on hover (desktop only) */}
      <div className="relative overflow-hidden flex-shrink-0 transition-all duration-500 h-[220px] sm:h-[320px] sm:group-hover:h-[200px]">
        {year.gardenImage ? (
          <Image
            src={year.gardenImage}
            alt={year.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: `${titleColor}30` }} />
        )}
      </div>

      {/* Content — grows on hover */}
      <div className="flex-1 flex flex-col px-7 pt-5 pb-1 overflow-hidden transition-all duration-500" style={{ backgroundColor: `${titleColor}18` }}>
        {/* Always visible: name */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-2xl font-black leading-tight" style={{ color: titleColor }}>
            {year.gardenName || year.title}
          </h3>
          <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border border-ink text-ink opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            {artworkCount} יצירות
          </span>
        </div>

        {/* Revealed on hover */}
        <div className="overflow-hidden max-h-40 sm:max-h-0 sm:group-hover:max-h-40 transition-all duration-500 flex flex-col gap-1.5">
          {year.teacherName && !year.gardenDescription?.includes(year.teacherName) && (
            <p className="text-sm font-medium text-ink-light">גננת: {year.teacherName}</p>
          )}
          {year.gardenDescription && (
            <p className="text-sm leading-relaxed line-clamp-2 text-ink-light">
              {year.gardenDescription}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1 mb-1 text-sm font-bold text-ink group-hover:gap-3 transition-all">
            <span>לגלריה</span>
            <span>←</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
