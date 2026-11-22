import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import type { KindergartenYear, Artwork, BrilliantQuote, Song } from "./types";

const wixClient = createClient({
  modules: { items },
  auth: ApiKeyStrategy({
    siteId: process.env.WIX_SITE_ID!,
    apiKey: process.env.WIX_API_KEY!,
  }),
});

// ─── Kindergarten Years ───────────────────────────────────────────────────────

export async function getKindergartenYears(): Promise<KindergartenYear[]> {
  const response = await wixClient.items
    .query("kindergartenyears")
    .ascending("yearStart")
    .find();

  return (response.items ?? []).map(mapYear);
}

export async function getKindergartenYear(id: string): Promise<KindergartenYear | null> {
  try {
    const item = await wixClient.items.get("kindergartenyears", id);
    if (!item) return null;
    return mapYear(item);
  } catch {
    return null;
  }
}

// ─── Artworks ─────────────────────────────────────────────────────────────────

export async function getArtworksByYear(yearId: string): Promise<Artwork[]> {
  const response = await wixClient.items
    .query("artworks")
    .eq("kindergartenyear", yearId)
    .descending("creationDate")
    .find();

  return (response.items ?? []).map(mapArtwork);
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    const item = await wixClient.items.get("artworks", id);
    if (!item) return null;
    return mapArtwork(item);
  } catch {
    return null;
  }
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const response = await wixClient.items
    .query("artworks")
    .descending("creationDate")
    .find();

  return (response.items ?? []).map(mapArtwork);
}

// ─── Songs & Soundtrack ───────────────────────────────────────────────────────

async function fetchSpotifyMeta(spotifyUrl: string): Promise<{ title: string; artist: string; coverImage: string } | null> {
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`);
    if (!res.ok) return null;
    const data = await res.json() as { title?: string; author_name?: string; thumbnail_url?: string };
    if (!data.title || !data.author_name) return null;
    return { title: data.title, artist: data.author_name, coverImage: data.thumbnail_url ?? "" };
  } catch {
    return null;
  }
}

export async function getSongs(): Promise<Song[]> {
  const response = await wixClient.items
    .query("songs")
    .descending("date")
    .find();

  const songs = (response.items ?? []).map(mapSong);

  return Promise.all(
    songs.map(async (song) => {
      if (!song.spotifyUrl) return song;
      const meta = await fetchSpotifyMeta(song.spotifyUrl);
      if (!meta) return song;
      return {
        ...song,
        title: meta.title,
        artist: meta.artist,
        coverImage: meta.coverImage,
      };
    })
  );
}

// ─── Brilliant Quotes ─────────────────────────────────────────────────────────

export async function getBrilliantQuotes(): Promise<BrilliantQuote[]> {
  const response = await wixClient.items
    .query("BrilliantQuotes")
    .descending("date")
    .find();

  return (response.items ?? []).map(mapQuote);
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapSong(item: Record<string, unknown>): Song {
  return {
    _id: item._id as string,
    title: "",
    artist: "",
    type: item["type"] as string | undefined,
    date: item["date"] as string | undefined,
    spotifyUrl: item["spotifyUrl"] as string | undefined,
    ofriNote: item["ofriNote"] as string | undefined,
    ofriNickname: item["ofriNickname"] as string | undefined,
  };
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "<br/>")
    .replace(/class="[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "")
    .replace(/dir="[^"]*"/g, "")
    .trim();
}

function mapQuote(item: Record<string, unknown>): BrilliantQuote {
  const rawQuote = item["quote"] as string | undefined;
  return {
    _id: item._id as string,
    title: (item["title"] ?? "") as string,
    quote: rawQuote ? sanitizeHtml(rawQuote) : undefined,
    context: item["context"] as string | undefined,
    illustration: extractImageUrl(item["illustration"]),
    date: item["date"] as string | undefined,
  };
}

function mapYear(item: Record<string, unknown>): KindergartenYear {
  return {
    _id: item._id as string,
    title: (item["title"] ?? item["yearName"] ?? "") as string,
    gardenName: item["yearName"] as string | undefined,
    gardenDescription: (item["kindergartenDescription"] ?? item["gardenDescription"]) as string | undefined,
    yearStart: (item["startDate"] ?? item["yearStart"]) as string | undefined,
    yearEnd: (item["endDate"] ?? item["yearEnd"]) as string | undefined,
    teacherName: item["teacherName"] as string | undefined,
    gardenImage: extractImageUrl(item["kindergartenPhoto"] ?? item["gardenImage"]),
  };
}

function mapArtwork(item: Record<string, unknown>): Artwork {
  return {
    _id: item._id as string,
    title: (item["title"] ?? "") as string,
    artworkImage: extractImageUrl(item["artworkImage"]),
    kindergartenYear: item["kindergartenyear"] as string | undefined,
    creationDate: item["creationDate"] as string | undefined,
    artistComment: item["artistComment"] as string | undefined,
    medium: item["medium"] as string | undefined,
    tags: item["tags"] as string[] | undefined,
  };
}

function extractImageUrl(field: unknown): string | undefined {
  if (!field) return undefined;

  let raw: string | undefined;

  if (typeof field === "string") {
    raw = field;
  } else if (typeof field === "object" && field !== null) {
    const f = field as Record<string, unknown>;
    raw = (f.url ?? f.src ?? f.uri) as string | undefined;
  }

  if (!raw) return undefined;

  // Convert wix:image://v1/{fileId}/{filename}#... → https://static.wixstatic.com/media/{fileId}
  if (raw.startsWith("wix:image://")) {
    const withoutProtocol = raw.replace("wix:image://v1/", "");
    const fileId = withoutProtocol.split("/")[0];
    return `https://static.wixstatic.com/media/${fileId}`;
  }

  return raw;
}
