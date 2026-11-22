export default function WavyRibbon({
  text = "יצירות · אמנות · גן הילדים · ",
  color = "#dcaeb9",
  textColor = "#ffffff",
}: {
  text?: string;
  color?: string;
  textColor?: string;
}) {
  const repeated = text.repeat(12);

  return (
    <div dir="ltr">
      <svg
        viewBox="0 0 1440 360"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        overflow="visible"
        aria-hidden
      >
        <defs>
          <path
            id="wave-path"
            d="M -60,60 C 180,-20 420,200 680,120 C 940,40 1180,280 1500,240"
          />
        </defs>

        <use
          href="#wave-path"
          fill="none"
          stroke={color}
          strokeWidth="90"
          strokeLinecap="butt"
        />

        <text
          fill={textColor}
          fontSize="24"
          fontWeight="700"
          letterSpacing="3"
        >
          <textPath href="#wave-path" startOffset="0%" dy="6">
            {repeated}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
