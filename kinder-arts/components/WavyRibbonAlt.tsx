"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function WavyRibbonAlt({
  text = "יצירות · אמנות · גן הילדים · ",
  color,
  textColor = "#ffffff",
}: {
  text?: string;
  color?: string;
  textColor?: string;
}) {
  const { theme } = useTheme();
  const resolvedColor = color ?? (theme.id === "fun" ? "#ff3d9a" : "#899ccf");
  const repeated = text.repeat(16);

  return (
    <svg
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="visible"
      aria-hidden
    >
      <defs>
        {/* 3 humps, shallower amplitude */}
        <path
          id="wave-path-alt"
          d="M -40,110 C 140,40 280,180 480,110 C 680,40 820,180 960,110 C 1140,40 1300,180 1480,110"
        />
      </defs>

      <use
        href="#wave-path-alt"
        fill="none"
        stroke={resolvedColor}
        strokeWidth="56"
        strokeLinecap="butt"
      />

      <text
        fill={textColor}
        fontSize="14"
        fontWeight="700"
        letterSpacing="3"
        direction="ltr"
        unicodeBidi="normal"
      >
        <textPath href="#wave-path-alt" startOffset="0%" dy="5">
          {repeated}
        </textPath>
      </text>
    </svg>
  );
}
