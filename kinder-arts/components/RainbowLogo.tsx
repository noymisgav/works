export default function RainbowLogo({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        WebkitMaskImage: "url(/logo-ofri.svg)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: "url(/logo-ofri.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        background: "#1A1A1A",
      }}
    />
  );
}
