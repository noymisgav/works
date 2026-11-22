"use client";

import { useEffect, useRef, useState } from "react";

const GARDEN_EMOJIS: Record<string, string> = {
  "גן זית": "🫒",
  "גן אתרוג": "🍋",
  "יצירות מהבית": "🏠",
};

export default function GardenCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [emoji, setEmoji] = useState("");
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const card = (e.target as HTMLElement).closest("[data-garden]");
      if (card) {
        const name = card.getAttribute("data-garden") || "";
        const found = Object.entries(GARDEN_EMOJIS).find(([key]) => name.includes(key));
        setEmoji(found ? found[1] : "🌿");
      } else {
        setEmoji("");
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] select-none text-3xl transition-opacity duration-150"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        opacity: emoji ? 1 : 0,
      }}
    >
      {emoji || "🫒"}
    </div>
  );
}
