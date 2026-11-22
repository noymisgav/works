// Zero-dependency Wix API client (uses Node.js built-in fetch)
const WIX_SITE_ID = process.env.WIX_SITE_ID;
const WIX_API_KEY = process.env.WIX_API_KEY;

function wixHeaders(extraHeaders = {}) {
  return {
    Authorization: WIX_API_KEY,
    "wix-site-id": WIX_SITE_ID,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

async function wixPost(path, body) {
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method: "POST",
    headers: wixHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wix API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── CMS ─────────────────────────────────────────────────────────────────────

async function createItem(collectionId, data) {
  const result = await wixPost("/wix-data/v2/items", {
    dataCollectionId: collectionId,
    dataItem: { data },
  });
  return result.dataItem;
}

async function queryItems(collectionId, limit = 50) {
  const result = await wixPost("/wix-data/v2/items/query", {
    dataCollectionId: collectionId,
    query: { paging: { limit } },
  });
  return result.dataItems || [];
}

// ─── Media Upload ─────────────────────────────────────────────────────────────

async function uploadImage(imageBuffer, fileName, mimeType = "image/jpeg") {
  // Step 1: generate upload URL
  const genRes = await wixPost("/site-media/v1/files/generate-upload-url", {
    mimeType,
    fileName,
  });
  const uploadUrl = genRes.uploadUrl;
  if (!uploadUrl) throw new Error("No uploadUrl returned from Wix");

  // Step 2: PUT binary directly to the signed URL
  const url = new URL(uploadUrl);
  url.searchParams.set("filename", fileName);

  const res = await fetch(url.toString(), {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: imageBuffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image upload failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  const fileId = data?.file?.id;
  if (!fileId) throw new Error("Upload failed: no fileId in response");

  const w = data?.file?.media?.image?.image?.width || 0;
  const h = data?.file?.media?.image?.image?.height || 0;
  return `wix:image://v1/${fileId}/${fileName}#originWidth=${w}&originHeight=${h}`;
}

async function getKindergartenYears() {
  return queryItems("kindergartenyears");
}

module.exports = { createItem, queryItems, uploadImage, getKindergartenYears };
