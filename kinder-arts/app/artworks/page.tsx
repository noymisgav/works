export const revalidate = 0;

import Navbar from "@/components/Navbar";
import QuoteBanner from "@/components/QuoteBanner";
import ColoringCanvas from "@/components/ColoringCanvas";
import WavyRibbonAlt from "@/components/WavyRibbonAlt";
import YearCardsVertical from "@/components/YearCardsVertical";
import HeroBg from "@/components/HeroBg";
import ArtworkQuote from "@/components/ArtworkQuote";
import { getKindergartenYears, getAllArtworks } from "@/lib/wix";

function getOfriAge() {
  const birth = new Date(2021, 6, 17); // 17.07.2021
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth() + (now.getDate() < birth.getDate() ? -1 : 0);
  const fullYears = months < 0 ? years - 1 : years;
  const remainingMonths = ((months % 12) + 12) % 12;
  return remainingMonths >= 6 ? `${fullYears}.5` : `${fullYears}`;
}

export default async function ArtworksPage() {
  const [years, allArtworks] = await Promise.all([
    getKindergartenYears(),
    getAllArtworks(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="relative py-16 text-center px-6 overflow-hidden" style={{ background: "var(--cream-muted)" }}>
          <HeroBg />
          <div className="relative z-10">
            <p className="text-teal font-bold text-sm tracking-widest uppercase mb-2">
              הגלריה של עפרי
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-ink">
              יצירות מהשנים
            </h1>
            <p className="text-ink-light mt-3 text-lg font-normal">
              ציורים, יצירות, ומה שבינהם
            </p>
          </div>
        </div>
        <hr className="doodle-hr-dashed w-full" />

        {/* ── Year Cards ───────────────────────────────── */}
        {years.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end gap-4 mb-12 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-black text-ink leading-none">כל שנה, עולם אחר</h2>
            </div>
            <YearCardsVertical
              years={years}
              artworkCounts={Object.fromEntries(
                years.map(y => [y._id, allArtworks.filter(a => a.kindergartenYear === y._id).length])
              )}
            />
          </section>
        )}

        {/* ── About the Artist ─────────────────────────── */}
        <section className="py-20" style={{ background: "var(--cream)" }}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col gap-4">
            <div>
              <span className="text-teal font-bold text-sm tracking-widest uppercase">
                הכירו את האמן
              </span>
              <h1 className="text-4xl font-black text-ink mt-1">עפרי, בן {getOfriAge()}</h1>
            </div>
            <p className="text-ink-light leading-relaxed text-lg">
              עפרי הוא אמן עכשווי מוביל בסצנת הגן, המתמחה בסגנון
              &ldquo;מה-שיצא-יצא&rdquo; ובטכניקת הצביעה מחוץ לקווים.
            </p>
            <p className="text-ink-light leading-relaxed">
              יצירותיו נוצרו בין השעות 9:00 ל-11:30 בבוקר, בדרך כלל אחרי ארוחת הבוקר
              ולפני שעת השינה. הוא עובד בעיקר עם גואש, פסטל, וכל דבר שנמצא בהישג יד.
            </p>
          </div>
        </section>

        {/* ── Quote with portrait peeking behind ───────── */}
        <ArtworkQuote />

        <div>
          <WavyRibbonAlt text="בואו נצייר • בואו נצייר • בואו נצייר • " textColor="var(--cream)" />
        </div>

        {/* ── Draw CTA ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-ink mb-3">בואו נצייר</h2>
            <p className="text-ink-light">תציירו לי ציור. ואני אשמור אותו פה בגלריה של הציורים של האורחים שלי</p>
          </div>
          <ColoringCanvas />
        </section>

      </main>

      <footer className="border-t border-border py-10">
        <p className="text-center text-ink-light text-sm tracking-widest">
          ✦ &nbsp; נוצר באהבה עבור עפרי &nbsp; ✦
        </p>
      </footer>
    </>
  );
}
