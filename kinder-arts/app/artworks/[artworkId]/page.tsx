export const revalidate = 0;

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getArtwork, getKindergartenYear } from "@/lib/wix";

interface Props {
  params: Promise<{ artworkId: string }>;
}

export default async function ArtworkPage({ params }: Props) {
  const { artworkId } = await params;

  const artwork = await getArtwork(artworkId);
  if (!artwork) notFound();

  const year = artwork.kindergartenYear
    ? await getKindergartenYear(artwork.kindergartenYear)
    : null;

  const formattedDate = artwork.creationDate
    ? new Date(artwork.creationDate).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            href={year ? `/years/${year._id}` : "/"}
            className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink transition-colors mb-10"
          >
            <span>→</span>
            <span>{year ? `חזרה ל${year.title}` : "חזרה לבית"}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg bg-border/20">
              {artwork.artworkImage ? (
                <div className="relative aspect-square">
                  <Image
                    src={artwork.artworkImage}
                    alt={artwork.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center text-8xl opacity-20">
                  🎨
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              {year && (
                <Link
                  href={`/years/${year._id}`}
                  className="inline-flex items-center gap-2 text-teal text-sm font-semibold bg-teal/10 px-3 py-1.5 rounded-full w-fit hover:bg-teal/20 transition-colors"
                >
                  {year.title}
                </Link>
              )}

              <div>
                <h1 className="text-4xl font-black text-ink leading-tight">
                  {artwork.title}
                </h1>
                {formattedDate && (
                  <p className="text-ink-light text-sm mt-2">{formattedDate}</p>
                )}
              </div>

              {artwork.medium && (
                <div className="flex items-start gap-3 bg-card rounded-2xl p-4 border border-border">
                  <span className="text-xl">🖌️</span>
                  <div>
                    <p className="text-xs text-ink-light font-medium uppercase tracking-widest mb-0.5">
                      חומרים
                    </p>
                    <p className="text-ink font-semibold">{artwork.medium}</p>
                  </div>
                </div>
              )}

              {artwork.artistComment && (
                <div className="bg-yellow/20 rounded-2xl p-5 border border-yellow/30">
                  <p className="text-xs text-ink-light font-medium uppercase tracking-widest mb-2">
                    מה אמר האמן
                  </p>
                  <blockquote className="text-ink text-lg leading-relaxed font-medium">
                    &ldquo;{artwork.artistComment}&rdquo;
                  </blockquote>
                </div>
              )}

              {artwork.tags && artwork.tags.length > 0 && (
                <div>
                  <p className="text-xs text-ink-light font-medium uppercase tracking-widest mb-3">
                    תגיות
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm bg-card border border-border text-ink-light px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <p className="text-center text-ink-light text-sm">
          ✦ נוצר באהבה עבור עופרי ✦
        </p>
      </footer>
    </>
  );
}
