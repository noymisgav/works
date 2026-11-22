import Navbar from "@/components/Navbar";
import ColoringCanvas from "@/components/ColoringCanvas";

export default function DrawPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="flex items-baseline gap-4 mb-8">
          <h1 className="text-5xl font-black text-ink">בואו נצייר</h1>
          <span className="text-ink-light">גם אתם יכולים ליצור</span>
        </div>
        <ColoringCanvas />
      </main>
    </>
  );
}
