"use client";

import { useEffect, useRef, useState } from "react";

export default function ArtworkCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      const overArtwork = !!(e.target as HTMLElement).closest("[data-artwork]");
      setVisible(overArtwork);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 select-none"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="text-3xl transition-transform duration-200"
        style={{ transform: visible ? "scale(1) rotate(-20deg)" : "scale(0.5) rotate(0deg)" }}
      >
        🖌️
      </div>
    </div>
  );
}
