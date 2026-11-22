export const revalidate = 0;

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ArtworkSlider from "@/components/ArtworkSlider";
import WavyRibbon from "@/components/WavyRibbon";
import ParallaxHero from "@/components/ParallaxHero";
import { getAllArtworks } from "@/lib/wix";

export default async function HomePage() {
  const allArtworks = await getAllArtworks();

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden">

        {/* ── Painting Hero ────────────────────────────── */}
        <ParallaxHero />

        {/* ── Hero ─────────────────────────────────────── */}
        <section
          id="hero-section"
          className="relative"
          style={{
            "--dot-bg": "var(--cream)",
            "--dot-color": "#807870",
            "--dot-size": "1px",
            "--dot-space": "22px",
            background: `
              linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
              linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
              var(--dot-color)
            `,
          } as React.CSSProperties}
        >
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-10 flex items-center">

          {/* Text */}
          <div className="flex flex-col gap-6 relative z-10">
            <p className="font-bold text-sm tracking-[0.2em] uppercase" style={{ color: "var(--teal)" }}>
             ברוכים הבאים
            </p>
            <h1 className="text-[clamp(2.8rem,8vw,6rem)] font-black leading-[0.9] tracking-tight text-ink">
              העולם של{" "}
              <span className="pekpek-stroke">
                פקפק
              </span>
            </h1>
            <p className="text-lg text-ink-light leading-relaxed">
              מקום ששומרים בו ציורים, מחשבות ורגעים קטנים ששווה לזכור
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/artworks"
                className="doodle-border-primary inline-block font-black text-ink px-8 py-3 text-base transition-colors"
                style={{ transform: "rotate(-2deg)", display: "inline-block" }}
              >
                בואו לראות מה יצרתי
              </Link>
              <Link
                href="/upload"
                className="doodle-border inline-block font-black text-ink px-8 py-3 text-base transition-colors hover-pink"
                style={{ transform: "rotate(1.5deg)", display: "inline-block" }}
              >
                הוספת יצירה
              </Link>
            </div>
          </div>
          </div>
        </section>

        <div style={{
          background: `
            linear-gradient(90deg, var(--cream) calc(22px - 1px), transparent 1%) center / 22px 22px,
            linear-gradient(var(--cream) calc(22px - 1px), transparent 1%) center / 22px 22px,
            #807870
          `,
        }}>
          <WavyRibbon color="var(--teal)" text="יצירות • יציאות • סיפורים אמיתיים • אומנות • אישיות • אהבה • " textColor="var(--cream)" />
        </div>

        {/* ── What's here ──────────────────────────────── */}
        <section style={{
          background: `
            linear-gradient(90deg, var(--cream) calc(22px - 1px), transparent 1%) center / 22px 22px,
            linear-gradient(var(--cream) calc(22px - 1px), transparent 1%) center / 22px 22px,
            #807870
          `,
        }}>
          <div className="max-w-5xl mx-auto px-6 pt-2 pb-32">
            <h2 className="text-3xl sm:text-4xl font-black text-ink text-center mb-14">מה תמצאו פה בינתיים?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

              <div className="flex flex-col items-center gap-4 max-w-[180px] mx-auto">
                <img src="/arts.svg" alt="יצירות" className="w-16 h-16 object-contain theme-icon" />
                <h3 className="text-2xl font-black text-ink">יצירות</h3>
                <p className="text-ink-light text-base leading-relaxed">כל הציורים, ההדבקות והיצירות של עפרי — מהגן ומהבית</p>
              </div>

              <div className="flex flex-col items-center gap-4 max-w-[180px] mx-auto">
                <img src="/sentence.svg" alt="הגיגים" className="w-16 h-16 object-contain theme-icon" />
                <h3 className="text-2xl font-black text-ink">
                  <Link href="/quotes" className="hover:underline focus-visible:underline">
                    הגיגים
                  </Link>
                </h3>
                <p className="text-ink-light text-base leading-relaxed">דברים שעפרי אמר ואנחנו לא רוצים לשכוח</p>
              </div>

              <div className="flex flex-col items-center gap-4 max-w-[180px] mx-auto">
                <img src="/stickers.svg" alt="מדבקות" className="w-16 h-16 object-contain theme-icon" />
                <h3 className="text-2xl font-black text-ink">מדבקות</h3>
                <p className="text-ink-light text-base leading-relaxed">סטיקרים של עפרי<br />לשימוש חופשי בקבוצת המשפחה</p>
              </div>

            </div>
          </div>
        </section>

        <hr className="doodle-hr-dashed w-full" />

        {/* ── Artwork Slider ────────────────────────────── */}
        <section className="py-14" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-10">
          <h2 className="text-4xl font-black text-ink mb-8">יצירות אחרונות</h2>
          <ArtworkSlider artworks={allArtworks} />
        </div>
        </section>

        <hr className="doodle-hr-dashed w-full" />

      </main>

      <footer className="border-t border-border py-10">
        <p className="text-center text-ink-light text-sm tracking-widest">
          ✦ &nbsp; נוצר באהבה עבור עפרי &nbsp; ✦
        </p>
      </footer>
    </>
  );
}
