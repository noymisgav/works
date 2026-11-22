"use client";

import Image from "next/image";
import type { BrilliantQuote } from "@/lib/types";
import { useTheme } from "@/components/ThemeProvider";
import QuoteShareButton from "@/components/QuoteShareButton";

const OFRI_BIRTHDATE = new Date("2021-07-17");

function getAgeAtDate(date: string): string {
  const d = new Date(date);
  let years = d.getFullYear() - OFRI_BIRTHDATE.getFullYear();
  let months = d.getMonth() - OFRI_BIRTHDATE.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `בגיל ${months} חודשים`;
  if (months === 0) return `בגיל ${years}`;
  return `בגיל ${years} ו-${months} חודשים`;
}


export default function QuoteBook({ quotes }: { quotes: BrilliantQuote[] }) {
  const { theme } = useTheme();
  const TINT_COLORS = theme.tintColors;

  return (
    <div>
      {/* ── Mobile: cards ─────────────────────────────────────────────── */}
      <div className="flex sm:hidden flex-col gap-4 px-4 py-8">
        {quotes.map((q, i) => (
          <div
            key={q._id}
            className="rounded-3xl overflow-hidden flex flex-col shadow-md"
            style={{ background: "var(--card-bg)" }}
          >
            {/* Quote */}
            <div className="flex flex-col justify-center px-5 py-6 text-right">
              {q.context && (
                <p className="text-ink-light font-normal text-xs mb-2 italic">{q.context}</p>
              )}
              <blockquote
                className="text-base font-black text-ink leading-snug mb-3 quote-content"
                dangerouslySetInnerHTML={{ __html: q.quote || q.title }}
              />
            </div>

            {/* Illustration + date + share */}
            <div className="flex items-end justify-between pb-5 px-5 gap-2">
              {q.illustration ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-36 h-36">
                    <Image
                      src={q.illustration}
                      alt={q.title}
                      fill
                      className="object-contain"
                      sizes="144px"
                    />
                  </div>
                  {q.date && (
                    <p className="text-xs text-ink-light font-normal self-start">
                      — עפרי, {getAgeAtDate(q.date)}
                    </p>
                  )}
                </div>
              ) : (
                <div />
              )}
              <QuoteShareButton
                quoteHtml={q.quote || q.title}
                context={q.context}
                ageLabel={q.date ? getAgeAtDate(q.date) : undefined}
                illustration={q.illustration}
                bgColor={TINT_COLORS[i % TINT_COLORS.length]}
                isDark={theme.id === "fun"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: original full-screen layout ──────────────────────── */}
      <div className="hidden sm:block">
        {quotes.map((q, i) => (
          <div key={q._id}>
            <section
              className={`quote-section flex items-stretch gap-6 p-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              style={{ background: "var(--cream)" }}
            >
              {/* Quote — colored card, narrow */}
              <div
                className="w-[38%] flex-shrink-0 flex flex-col justify-between p-14 rounded-3xl"
                style={{ backgroundColor: TINT_COLORS[i % TINT_COLORS.length] }}
              >
                <div>
                  {q.context && (
                    <p className={`font-normal text-base mb-6 italic ${theme.id === "fun" ? "text-black/60" : "text-white/70"}`}>{q.context}</p>
                  )}
                  <blockquote
                    className={`text-2xl font-black leading-snug mb-8 quote-content ${theme.id === "fun" ? "text-black quote-content-dark" : "text-white quote-content-white"}`}
                    dangerouslySetInnerHTML={{ __html: q.quote || q.title }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  {q.date && (
                    <p className={`text-sm font-normal ${theme.id === "fun" ? "text-black/60" : "text-white/70"}`}>
                      — עפרי, {getAgeAtDate(q.date)}
                    </p>
                  )}
                  <QuoteShareButton
                    quoteHtml={q.quote || q.title}
                    context={q.context}
                    ageLabel={q.date ? getAgeAtDate(q.date) : undefined}
                    illustration={q.illustration}
                    bgColor={TINT_COLORS[i % TINT_COLORS.length]}
                    isDark={theme.id === "fun"}
                  />
                </div>
              </div>

              {/* Illustration — white card */}
              <div className="flex-1 flex items-center justify-center relative rounded-3xl" style={{ background: "#ffffff" }}>
                {q.illustration ? (
                  <div className="relative w-[60%]" style={{ minHeight: "45vh" }}>
                    <Image
                      src={q.illustration}
                      alt={q.title}
                      fill
                      className="object-contain"
                      sizes="50vw"
                    />
                  </div>
                ) : (
                  <div className="text-9xl">🎨</div>
                )}
                <p className="absolute bottom-6 left-10 text-xs text-ink-light opacity-40">
                  {String(i + 1).padStart(2, "0")} / {String(quotes.length).padStart(2, "0")}
                </p>
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
