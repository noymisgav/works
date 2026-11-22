# Kinder Arts — Project Overview

A personal website for **Ofri** (עפרי), a kid. Built by his mom Noy. Preserves his artworks, quotes, stickers, and a soundtrack of songs he loved — like a digital scrapbook.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router, `revalidate = 0` on all pages) |
| Styling | Tailwind CSS 4 with `@theme inline` CSS variable mapping |
| CMS | Wix Headless CMS via `@wix/sdk` + `@wix/data` |
| Deployment | Vercel |
| Language | TypeScript, RTL Hebrew (`<html dir="rtl">`) |

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — parallax hero (static image, no scroll animation), dot-pattern section, artwork slider |
| `/artworks` | `app/artworks/page.tsx` | Gallery — accordion by kindergarten year, artist bio, drawing canvas |
| `/years/[yearId]` | `app/years/[yearId]/page.tsx` | Single year — artworks grid |
| `/artworks/[artworkId]` | `app/artworks/[artworkId]/page.tsx` | Single artwork detail |
| `/quotes` | `app/quotes/page.tsx` | Quote book — alternating two-column desktop, card list mobile, share button |
| `/stickers` | `app/stickers/page.tsx` | Sticker pack download page |
| `/soundtrack` | `app/soundtrack/page.tsx` | Spotify timeline — filter by type (שיר/הסכת) |
| `/upload` | `app/upload/page.tsx` | Upload artwork form |
| `/draw` | `app/draw/page.tsx` | Interactive coloring canvas |

---

## Wix CMS Collections

### `kindergartenyears`
Fields: `title`, `yearName`, `kindergartenDescription`, `startDate`, `endDate`, `teacherName`, `kindergartenPhoto`

### `artworks`
Fields: `title`, `artworkImage`, `kindergartenyear` (ref to year), `creationDate`, `artistComment`, `medium`, `tags`

### `BrilliantQuotes`
Fields: `title`, `quote` (rich text HTML), `context`, `illustration` (image), `date`
- Bold text (`<strong>`) in quotes renders in **Reisinger-Neta Bold** (display font), teal color on web; teal in canvas share image

### `songs`
Fields: `title` (auto-populated from Spotify oEmbed), `spotifyUrl`, `type` (`שיר` or `הסכת`), `date`, `ofriNote`, `ofriNickname`
- `title` and `artist` are NOT stored in CMS — fetched at render time from `https://open.spotify.com/oembed?url=...`

---

## Design System

### Fonts
- **`font-sans`** → `Google Sans` (`/fonts/GoogleSans-Bold.ttf`, `GoogleSans_17pt-Regular.ttf`)
- **`font-display`** → `Reisinger-Neta` (`/fonts/Reisinger-Neta-web/*.woff2`) — used for expressive/display text (song nicknames, CMS bold in quotes)

### Themes (`lib/themes.ts`)
Two themes toggle via `ThemeProvider` (stored in localStorage):
- **`classic`** — warm cream tones (`--cream: #F7F2EA`), muted accent palette
- **`fun`** — dark mode (`--cream: #0d0b1a`), neon accent colors

Key CSS variables: `--cream`, `--cream-muted`, `--card-bg`, `--border`, `--ink`, `--ink-light`, `--teal`

### Typography pattern
- `font-black` → Google Sans 900 (Tailwind utility)
- `font-display` → Reisinger-Neta
- Inline bold in quotes → Reisinger-Neta Bold, 1.15em, teal (via `.quote-content strong` CSS)

### Doodle borders
Custom CSS classes in `public/doodle.css` + `app/doodle-custom.css`:
- `.doodle-border` — rough hand-drawn border
- `.doodle-border-primary` — primary action border
- `.doodle-border-card` — card wrapper

---

## Key Components

| Component | What it does |
|---|---|
| `Navbar.tsx` | Sticky nav. Desktop: horizontal links. Mobile: hamburger dropdown with emojis. Theme toggle button. |
| `ThemeProvider.tsx` | Context for current theme; reads/writes localStorage |
| `YearCardsVertical.tsx` | Accordion by kindergarten year — horizontal on desktop, vertical stack on mobile |
| `QuoteBook.tsx` | Quote layout — two-column desktop / card list mobile. Uses `dangerouslySetInnerHTML` for rich text. |
| `QuoteShareButton.tsx` | Generates a 1080×1350 PNG on canvas (white bg, illustration faded at 15% BL, inline bold rendering). Native share on mobile, download on desktop. |
| `SoundtrackTimeline.tsx` | Client component — Spotify embed timeline with type filter tabs |
| `ParallaxHero.tsx` | Full-screen hero image on homepage — static (parallax scroll animation was removed) |
| `ColoringCanvas.tsx` | Interactive drawing canvas on artworks page |
| `WavyRibbon.tsx` / `WavyRibbonAlt.tsx` | Animated marquee ribbon |
| `HeroBg.tsx` | Decorative background for hero sections |
| `GardenCursor.tsx` | Custom cursor (global, mounted in layout) |

---

## Data layer (`lib/wix.ts`)

- All fetches via `@wix/sdk` with `ApiKeyStrategy` (env: `WIX_SITE_ID`, `WIX_API_KEY`)
- `getSongs()` — queries CMS, then enriches each song with Spotify oEmbed in parallel
- `extractImageUrl()` — handles both `wix:image://v1/{fileId}/...` protocol URIs and plain URLs
- `sanitizeHtml()` — strips scripts, classes, styles from Wix rich text before rendering

---

## Wix API gotchas (hard-learned)

- `PUT /wix-data/v2/collections` — collection ID goes in the **body**, not the URL path (404 otherwise)
- Full PUT replaces all fields — always GET the collection first to get the current `revision` and field list
- `PATCH /patch-field` cannot add new fields — only update existing field properties
- Bulk patch uses `fieldModifications: [{ fieldPath, action: "SET_FIELD", setFieldOptions: { value: { stringValue } } }]` — NOT `data: {}`
- Wix site ID: `49f65b15-44bf-4bc4-b3b2-b34b5de13095`

---

## Responsive notes

- `md` breakpoint (768px) is the main mobile/desktop split
- Accordion (`YearCardsVertical`) — `flexDirection: column` on mobile, `row` on desktop, detected via `window.innerWidth` in a `useEffect`
- `פקפק` stroke — 2px mobile, 3px desktop (`.pekpek-stroke` class in `globals.css`)
- Navbar mobile menu closes automatically on route change (`useEffect` on `pathname`)
