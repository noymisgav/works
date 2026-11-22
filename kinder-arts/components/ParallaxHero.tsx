"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ParallaxHero() {
  const { theme } = useTheme();
  const isFun = theme.id === "fun";

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ background: "#000" }}>
      <div className={`${isFun ? "image-container-fun" : "image-container"} w-full h-full`} style={{ overflow: "hidden", position: "absolute", inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ofri-painting.png"
          alt="עפרי מצייר"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-color.png"
          alt="קינדר ארטס"
          className="w-48 sm:w-64 theme-icon"
        />
        <p className="text-white text-sm italic drop-shadow-md">
          ״כתבתי את השם שלי בערימה״
        </p>
      </div>
    </section>
  );
}
