# Wix CMS — User Prompt Examples

Real prompts collected from a live project session (Next.js + Wix CMS headless site).
Each prompt led to one or more Wix REST API calls.

---

## Collection Management

### Create a collection

> "I want to create a new CMS collection for a soundtrack page — a timeline that shows songs Ofri loved, with a title, the date he loved it, and a short note from him. I think we need to manage the songs in the CMS, right?"

**API:** `POST /wix-data/v2/collections`
**Fields created:** `spotifyUrl` (URL), `type` (TEXT), `date` (DATE), `ofriNote` (TEXT), `ofriNickname` (TEXT)

---

### Add a field to an existing collection

> "I want to add a nickname field for each song — how Ofri would call it. So we can store his nickname for the song and display it under the song title."

**API:** `PUT /wix-data/v2/collections` (full collection update with new field added)
**Field added:** `ofriNickname` (TEXT) — "How Ofri calls it"

---

### Make fields optional

> "Can you get the song name and artist from the Spotify link automatically? Instead of me entering it manually?"

**API:** `PUT /wix-data/v2/collections`
**Change:** `title` and `artist` fields set to `required: false` (later removed entirely)

---

### Remove fields from a collection

> "So delete the unnecessary fields from the collection."

**API:** `PUT /wix-data/v2/collections`
**Change:** `title` and `artist` fields removed from schema entirely, since they are now auto-fetched from Spotify oEmbed API at render time

---

## Data Items

### Bulk insert sample content

> "Let's put a few items in the collection as examples."

**API:** `POST /wix-data/v2/bulk/items/insert`
**Items inserted:** 5 items — mix of songs (שיר) and podcasts (הסכת), each with a Spotify URL, date, and a short note in Hebrew

---

### Bulk insert real content (no dates yet)

> "I'll add dates later."

**API:** `POST /wix-data/v2/bulk/items/insert`
**Items inserted:** 15 songs with Spotify URLs and types; dates omitted (user will fill in via CMS UI)

---

### Populate a field from a third-party API

> "Can you add a column for the song name and fill it in from Spotify?"

**API:** `GET https://open.spotify.com/oembed?url=...` (Spotify oEmbed, no auth) × 15 calls, then `POST /wix-data/v2/bulk/items/patch`
**Patch format:** `fieldModifications: [{ fieldPath, action: "SET_FIELD", setFieldOptions: { value: { stringValue } } }]`
**Result:** `title` field populated for all 15 items with names fetched from Spotify oEmbed

---

## Site & Collection Discovery

### List all sites

> *(Implicit — user authenticated with Wix MCP and needed the correct site to operate on)*

**API:** `ListWixSites` (MCP tool)
**Result:** Identified "Kinder Arts" (`id: 49f65b15-...`) as the target site

---

### Get collection schema

> *(Implicit — needed current revision number before updating the collection)*

**API:** `GET /wix-data/v2/collections/songs`
**Result:** Retrieved full schema + `revision: "1"` needed for subsequent PUT

---

## Patterns & Notes for Skill Design

### Things users assume the AI can do
- "Create a CMS collection" — users expect this to happen directly, not via manual UI steps
- "Add a field" — users expect a targeted field-add, not a full schema replacement
- "Delete unnecessary fields" — users expect the AI to know *which* fields are now unnecessary based on context
- "Can you get the data from the URL automatically?" — users expect the AI to know about third-party APIs (like Spotify oEmbed) and wire them up

### Friction points encountered
- `PATCH /patch-field` does not support adding *new* fields — only updating existing ones (error: `WDE0075: Unsupported field mask path(s): key`)
- `PUT /collections/{id}` returns 404 — collection ID must be in the body, not the path
- Full collection PUT replaces all fields — dangerous if not handled carefully; a dedicated "add field" endpoint would reduce risk

### Field schema users naturally describe
| User language | Field type |
|---|---|
| "date — month and year" | `DATE` |
| "a link to Spotify" | `URL` |
| "a short note / what he said" | `TEXT` |
| "nickname / how he calls it" | `TEXT` |
| "type — song or podcast" | `TEXT` (could be enum/select) |

### Operations users expect to be atomic but aren't
- "Add a field" requires GET (to get revision) → PUT (full schema replacement) — two API calls
- A single `POST /collections/{id}/fields` endpoint would match user mental model better
