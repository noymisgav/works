"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ArtworkQuote() {
  const { theme } = useTheme();
  const isFun = theme.id === "fun";
  const bg = isFun ? "#ff3d9a" : "#899ccf";
  const textColor = isFun ? "#000000" : "#ffffff";
  const subColor = isFun ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)";

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div
        className="doodle-border-card rounded-3xl px-10 py-10"
        style={{ backgroundColor: bg, position: "relative" }}
      >
        {/* Portrait floats left, overflows upward */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ofri-portrait.png"
          alt="עפרי האמן"
          className="hidden md:block object-contain drop-shadow-xl"
          style={{
            float: "left",
            width: "260px",
            marginTop: "-120px",
            marginLeft: "-20px",
            marginRight: "24px",
            position: "relative",
            zIndex: 1,
          }}
        />
        <p className="font-bold text-xl sm:text-2xl leading-snug mb-4" style={{ color: textColor }}>
          ״כדי לא לצאת מהקווים מציירים קו ולא עוברים אותו.״
        </p>
        <p className="text-sm font-bold" style={{ color: subColor }}>— עפריקי דיאמנט</p>
        <div style={{ clear: "both" }} />
      </div>
    </div>
  );
}
