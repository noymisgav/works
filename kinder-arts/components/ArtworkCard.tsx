import Link from "next/link";
import Image from "next/image";
import type { Artwork } from "@/lib/types";

interface Props {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: Props) {
  return (
    <Link
      href={`/artworks/${artwork._id}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-border/30">
        {artwork.artworkImage ? (
          <Image
            src={artwork.artworkImage}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
            🎨
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-ink text-base leading-snug line-clamp-1">
          {artwork.title}
        </h3>
        {artwork.medium && (
          <p className="text-sm text-ink-light mt-1">{artwork.medium}</p>
        )}
        {artwork.creationDate && (
          <p className="text-xs text-ink-light/70 mt-1">
            {new Date(artwork.creationDate).toLocaleDateString("he-IL", {
              year: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
