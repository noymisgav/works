"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BrilliantQuote } from "@/lib/types";

export default function QuotesSlider({ quotes }: { quotes: BrilliantQuote[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const q = quotes[current];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Quote */}
      <div className="relative max-w-2xl w-full min-h-[160px] flex items-center justify-center">
        <blockquote
          key={current}
          className="text-2xl sm:text-3xl font-black text-ink text-center leading-snug quote-content animate-fade-in"
          dangerouslySetInnerHTML={{ __html: q.quote || q.title }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ background: i === current ? "var(--ink)" : "var(--border)", transform: i === current ? "scale(1.4)" : "none" }}
            aria-label={`ציטוט ${i + 1}`}
          />
        ))}
      </div>

      <Link
        href="/quotes"
        className="text-sm font-bold text-ink-light hover:text-ink transition-colors underline underline-offset-4"
      >
        לכל הציטוטים ←
      </Link>
    </div>
  );
}
