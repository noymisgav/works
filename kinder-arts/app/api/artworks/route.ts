import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { items } from "@wix/data";

const wixClient = createClient({
  modules: { items },
  auth: ApiKeyStrategy({
    siteId: process.env.WIX_SITE_ID!,
    apiKey: process.env.WIX_API_KEY!,
  }),
});

export async function POST(req: NextRequest) {
  // Verify password
  const password = req.headers.get("x-upload-password");
  if (password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, artworkImage, kindergartenYear, creationDate, artistComment, medium, tags } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const dataItem: Record<string, unknown> = { title };
  if (artworkImage) dataItem.artworkImage = artworkImage;
  if (kindergartenYear) dataItem.kindergartenyear = kindergartenYear;
  if (creationDate) dataItem.creationDate = creationDate;
  if (artistComment) dataItem.artistComment = artistComment;
  if (medium) dataItem.medium = medium;
  if (tags && tags.length > 0) dataItem.tags = tags;

  try {
    const result = await wixClient.items.insert("artworks", dataItem);
    return NextResponse.json({ success: true, id: result._id });
  } catch (err) {
    console.error("Wix insert error:", err);
    return NextResponse.json({ error: "Failed to save artwork" }, { status: 502 });
  }
}
