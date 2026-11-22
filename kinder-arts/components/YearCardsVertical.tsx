"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

type Year = {
  _id: string;
  title: string;
  gardenName?: string;
  teacherName?: string;
  gardenImage?: string;
  gardenDescription?: string;
};

export default function YearCardsVertical({
  years,
  artworkCounts,
}: {
  years: Year[];
  artworkCounts: Record<string, number>;
}) {
  const { theme } = useTheme();
  const COLORS = theme.accordionColors;
  const [activeIndex, setActiveIndex] = useState(years.length - 1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("[data-year-index]");
      if (btn) {
        const idx = parseInt(btn.getAttribute("data-year-index") || "0");
        setActiveIndex(idx);
      }
    };
    container.addEventListener("mousedown", handler);
    return () => container.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="doodle-border-card" style={{ borderRadius: "24px", width: "100%" }}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: isMobile ? "auto" : "500px",
          minHeight: isMobile ? "420px" : undefined,
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {years.map((year, i) => {
          const isActive = i === activeIndex;
          const color = COLORS[i % COLORS.length];
          const count = artworkCounts[year._id] ?? 0;
          const label = year.gardenName || year.title;

          return (
            <button
              key={year._id}
              type="button"
              data-year-index={i}
              style={{
                position: "relative",
                flex: isActive ? "4 1 0%" : isMobile ? "0 0 52px" : "0 0 52px",
                transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: color,
                display: "flex",
                flexDirection: isMobile
                  ? "column"
                  : isActive ? "row-reverse" : "row",
                border: "none",
                padding: 0,
                textAlign: "right",
                width: isMobile ? "100%" : undefined,
              }}
            >
              {/* Strip label */}
              <div style={{
                flexShrink: 0,
                width: isMobile ? "100%" : "52px",
                height: isMobile ? "52px" : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "flex-start" : "center",
                backgroundColor: color,
                padding: isMobile ? "0 20px" : undefined,
                position: "relative",
                pointerEvents: "none",
              }}>
                <span style={{
                  writingMode: isMobile ? "horizontal-tb" : "vertical-rl",
                  transform: isMobile ? "none" : "rotate(180deg)",
                  color: theme.id === "fun" ? "#0d0b1a" : "white",
                  fontWeight: 900,
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}>
                  {label}
                </span>
              </div>

              {/* Content area */}
              <div style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                pointerEvents: "none",
              }}>
                {/* Background image */}
                {year.gardenImage && (
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <Image
                      src={year.gardenImage}
                      alt={label}
                      fill
                      style={{
                        objectFit: "cover",
                        objectPosition: "top",
                        filter: "brightness(75%) contrast(125%) grayscale(100%) sepia(50%)",
                      }}
                      sizes="70vw"
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse at bottom right, rgba(0,0,0,0.75) 0%, ${color}88 45%, transparent 100%)`,
                    }} />
                  </div>
                )}

                {/* Text content */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: isMobile ? "24px 20px" : "40px",
                  gap: "8px",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  pointerEvents: "none",
                  zIndex: 1,
                }}>
                  <h2 style={{ color: "white", fontSize: isMobile ? "28px" : "44px", fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
                    {label}
                  </h2>
                  {year.teacherName && (
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0, fontWeight: 700 }}>
                      גננת: {year.teacherName}
                    </p>
                  )}
                  {year.gardenDescription && (
                    <p style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      maxWidth: "420px",
                    }}>
                      {year.gardenDescription}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
                    <Link
                      href={`/years/${year._id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--ink)",
                        fontSize: "13px",
                        fontWeight: 900,
                        padding: "8px 20px",
                        borderRadius: "999px",
                        textDecoration: "none",
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 10,
                      }}
                    >
                      {count} יצירות ←
                    </Link>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
