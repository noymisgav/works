export const revalidate = 0;

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ArtworkCard from "@/components/ArtworkCard";
import { getKindergartenYear, getArtworksByYear } from "@/lib/wix";

interface Props {
  params: Promise<{ yearId: string }>;
}

export default async function YearPage({ params }: Props) {
  const { yearId } = await params;

  const [year, artworks] = await Promise.all([
    getKindergartenYear(yearId),
    getArtworksByYear(yearId),
  ]);

  if (!year) notFound();

  const yearRange = [year.yearStart, year.yearEnd]
    .filter(Boolean)
    .map((d) =>
      new Date(d!).toLocaleDateString("he-IL", { year: "numeric", month: "long" })
    )
    .join(" – ");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Year header */}
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink transition-colors mb-8"
          >
            <span>→</span>
            <span>חזרה לכל השנים</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {year.gardenImage && (
              <div className="relative h-72 lg:h-96 rounded-3xl overflow-hidden shadow-md">
                <Image
                  src={year.gardenImage}
                  alt={year.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}

            <div className="flex flex-col justify-center gap-4">
              <div>
                <span className="text-teal text-sm font-semibold tracking-widest uppercase">
                  שנת גן
                </span>
                <h1 className="text-4xl lg:text-5xl font-black text-ink mt-1 leading-tight">
                  {year.title}
                </h1>
              </div>

              {year.teacherName && (
                <div className="flex items-center gap-2 text-ink-light">
                  <span className="text-lg">👩‍🏫</span>
                  <span className="font-medium">גננת: {year.teacherName}</span>
                </div>
              )}

              {yearRange && (
                <div className="flex items-center gap-2 text-ink-light">
                  <span className="text-lg">📅</span>
                  <span className="text-sm">{yearRange}</span>
                </div>
              )}

              {year.gardenDescription && (
                <p className="text-ink-light leading-relaxed text-base max-w-md">
                  {year.gardenDescription}
                </p>
              )}

              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-4 py-2 rounded-full w-fit">
                <span>🎨</span>
                <span>{artworks.length} יצירות</span>
              </div>
            </div>
          </div>
        </section>

        {/* Artworks grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-black text-ink mb-8">
              יצירות מהשנה
            </h2>

            {artworks.length === 0 ? (
              <div className="text-center py-20 text-ink-light">
                <p className="text-5xl mb-4">🖼️</p>
                <p className="text-lg">אין יצירות עדיין לשנה זו</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {artworks.map((artwork) => (
                  <ArtworkCard key={artwork._id} artwork={artwork} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="text-center text-ink-light text-sm">
          ✦ נוצר באהבה עבור עופרי ✦
        </p>
      </footer>
    </>
  );
}
