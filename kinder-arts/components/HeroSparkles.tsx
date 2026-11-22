"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#dcaeb9", "#f0b75f", "#88b8a2", "#d77953", "#899ccf"];
const EMOJIS = ["✦", "★", "✿", "♥", "✦"];

export default function HeroSparkles({ sectionId }: { sectionId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const i = counterRef.current++ % COLORS.length;

      const el = document.createElement("span");
      el.textContent = EMOJIS[i];
      el.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        color: ${COLORS[i]};
        font-size: ${Math.random() * 10 + 14}px;
        pointer-events: none;
        user-select: none;
        transform: translate(-50%, -50%);
        animation: sparkle-fade 0.9s ease-out forwards;
        z-index: 50;
        font-weight: bold;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 900);
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [sectionId]);

  return (
    <>
      <style>{`
        @keyframes sparkle-fade {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -200%) scale(0.3); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 50 }}
      />
    </>
  );
}
