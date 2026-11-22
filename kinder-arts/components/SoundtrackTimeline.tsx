"use client";

import { useState } from "react";
import type { Song } from "@/lib/types";

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

type Filter = "הכל" | "שיר" | "הסכת";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "הכל", value: "הכל" },
  { label: "שירים", value: "שיר" },
  { label: "הסכתים", value: "הסכת" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: HEBREW_MONTHS[d.getUTCMonth()],
    year: String(d.getUTCFullYear()),
  };
}

function toEmbedUrl(url: string): string | null {
  const m = url.match(/spotify\.com\/(track|episode|playlist|album)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator` : null;
}

export default function SoundtrackTimeline({ songs }: { songs: Song[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("הכל");

  const filtered = activeFilter === "הכל"
    ? songs
    : songs.filter((s) => s.type === activeFilter);

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        {FILTERS.map(({ label, value }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
              style={
                isActive
                  ? { background: "var(--teal)", color: "var(--cream)" }
                  : { background: "var(--cream-muted)", color: "var(--ink-light)" }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {filtered.map((song, i) => {
          const embedUrl = song.spotifyUrl ? toEmbedUrl(song.spotifyUrl) : null;
          const dateInfo = song.date ? formatDate(song.date) : null;
          const isPodcast = song.type === "הסכת";

          return (
            <div key={song._id} className="relative flex gap-5 pb-10 last:pb-0">
              {/* Date + dot + connecting line */}
              <div className="flex flex-col items-center w-20 shrink-0 pt-1">
                {dateInfo && (
                  <div className="text-center leading-tight">
                    <div className="text-xs font-bold text-teal">{dateInfo.month}</div>
                    <div className="text-xs text-ink-light">{dateInfo.year}</div>
                  </div>
                )}
                <div className="mt-2 w-3.5 h-3.5 rounded-full bg-teal ring-2 ring-card shrink-0" />
                {i < filtered.length - 1 && (
                  <div className="mt-1 flex-1 w-px bg-border" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{isPodcast ? "🎙️" : "🎵"}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-ink-light font-medium"
                    style={{ background: "var(--cream-muted)" }}
                  >
                    {song.type ?? "שיר"}
                  </span>
                </div>

                <h2 className="font-bold text-ink text-lg leading-tight">{song.title}</h2>
                {song.ofriNickname && (
                  <p className="text-ink text-lg font-bold font-display">{song.ofriNickname}</p>
                )}
                <p className="text-ink-light text-sm mb-4">{song.artist}</p>

                {embedUrl && (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="152"
                    style={{ border: "none", borderRadius: "12px", display: "block" }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                )}

                {song.ofriNote && (
                  <p className="mt-4 text-sm text-ink-light border-r-2 border-teal pr-3 py-0.5">
                    &ldquo;{song.ofriNote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
