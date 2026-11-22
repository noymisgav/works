export default function QuoteBanner({
  quote,
  author,
  color = "#899ccf",
  textColor = "#ffffff",
}: {
  quote: string;
  author?: string;
  color?: string;
  textColor?: string;
}) {
  const fullText = author ? `${quote}     ${author}` : quote;

  return (
    <svg
      viewBox="0 0 1440 260"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="visible"
      aria-hidden={false}
    >
      <defs>
        {/* Unique shape: sharp asymmetric peaks — two tall spikes + one shallow dip */}
        <path
          id="quote-wave"
          d="M -60,160 L 180,60 L 280,140 L 480,30 L 580,150 L 780,80 L 960,170 L 1160,50 L 1300,140 L 1500,70"
        />
      </defs>

      {/* Ribbon — thick stroke */}
      <use
        href="#quote-wave"
        fill="none"
        stroke={color}
        strokeWidth="68"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />

      {/* Quote text along the path */}
      <text
        fill={textColor}
        fontSize="14"
        fontWeight="700"
        letterSpacing="2"
        direction="ltr"
        unicodeBidi="normal"
      >
        <textPath href="#quote-wave" startOffset="5%" dy="5">
          {fullText}
        </textPath>
      </text>
    </svg>
  );
}
