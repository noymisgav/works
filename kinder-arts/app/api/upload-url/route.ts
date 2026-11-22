import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Verify password
  const password = req.headers.get("x-upload-password");
  if (password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mimeType, fileName } = await req.json();
  if (!mimeType || !fileName) {
    return NextResponse.json({ error: "Missing mimeType or fileName" }, { status: 400 });
  }

  const res = await fetch(
    "https://www.wixapis.com/site-media/v1/files/generate-upload-url",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.WIX_API_KEY!,
        "wix-site-id": process.env.WIX_SITE_ID!,
      },
      body: JSON.stringify({ mimeType, fileName }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Wix upload-url error:", res.status, text);
    return NextResponse.json({ error: "Failed to get upload URL", details: text }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
