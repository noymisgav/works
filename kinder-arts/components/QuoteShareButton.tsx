"use client";

const CANVAS_W = 1080;
const PAD = 90;
const PAD_LEFT = 160;
const CORNER_RADIUS = 64;
const FOOTER_H = 130; // reserved zone at bottom for attribution + watermark
const FONT_SIZE = 47;           // main quote
const FONT_SIZE_SECONDARY = 34; // context, pink/accent, attribution, watermark
const INK = "#1a1612";
const INK_LIGHT = "#8a7f74";
const ACCENT = "#dcaeb9"; // matches classic theme --teal (pink)

// ── Fonts ─────────────────────────────────────────────────────────────────────

async function loadFonts() {
  try {
    const bold = new FontFace("SiteBold", "url(/fonts/GoogleSans-Bold.ttf)", { weight: "700" });
    const regular = new FontFace("SiteRegular", "url(/fonts/GoogleSans_17pt-Regular.ttf)", { weight: "400" });
    const [b, r] = await Promise.all([bold.load(), regular.load()]);
    document.fonts.add(b);
    document.fonts.add(r);
  } catch {
    // continue with system fonts
  }
}

// ── Segment parsing ───────────────────────────────────────────────────────────

interface Segment { text: string; bold: boolean }

// Returns segments; text === "\n" marks a paragraph break
function parseSegments(html: string): Segment[] {
  const normalised = html
    .replace(/<\/p>/gi, "\n").replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&ldquo;/g, "\u201C").replace(/&rdquo;/g, "\u201D")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");

  const result: Segment[] = [];
  let bold = false;
  for (const part of normalised.split(/(<\/?(?:strong|b)>)/gi)) {
    if (/^<(?:strong|b)>$/i.test(part)) { bold = true; continue; }
    if (/^<\/(?:strong|b)>$/i.test(part)) { bold = false; continue; }
    const clean = part.replace(/<[^>]+>/g, "");
    if (!clean) continue;
    clean.split("\n").forEach((line, idx) => {
      if (idx > 0) result.push({ text: "\n", bold: false });
      if (line) result.push({ text: line, bold });
    });
  }
  return result;
}

// ── Word wrapping with mixed fonts ────────────────────────────────────────────

interface Word { text: string; bold: boolean }

function fontStr(bold: boolean) {
  return bold
    ? `400 ${FONT_SIZE_SECONDARY}px SiteRegular, system-ui, Arial, sans-serif`
    : `700 ${FONT_SIZE}px SiteBold, system-ui, Arial, sans-serif`;
}

function wrapSegments(
  ctx: CanvasRenderingContext2D,
  segments: Segment[],
  maxWidth: number
): Word[][] {
  const lines: Word[][] = [];
  let current: Word[] = [];
  let currentW = 0;

  const flush = () => { if (current.length) lines.push(current); current = []; currentW = 0; };

  for (const seg of segments) {
    if (seg.text === "\n") { flush(); continue; }
    ctx.font = fontStr(seg.bold);
    for (const word of seg.text.split(/(\s+)/).filter(Boolean)) {
      const w = ctx.measureText(word).width;
      if (currentW + w > maxWidth && current.length) flush();
      current.push({ text: word, bold: seg.bold });
      currentW += w;
    }
  }
  flush();
  while (lines.length && lines[0].every(w => !w.text.trim())) lines.shift();
  while (lines.length && lines[lines.length - 1].every(w => !w.text.trim())) lines.pop();
  return lines;
}

function wrapPlainText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string
): string[] {
  ctx.font = font;
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface Props {
  quoteHtml: string;
  context?: string;
  ageLabel?: string;
  illustration?: string;
  bgColor?: string;
  isDark?: boolean;
}

export default function QuoteShareButton({ quoteHtml, context, ageLabel, illustration }: Props) {
  async function handleShare() {
    await loadFonts();

    // ── 1. Load illustration first — dimensions needed for canvas sizing ──
    let imgEl: HTMLImageElement | null = null;
    let iw = 0, ih = 0;
    if (illustration) {
      try {
        imgEl = new window.Image();
        imgEl.crossOrigin = "anonymous";
        await new Promise<void>((res) => {
          imgEl!.onload = () => res();
          imgEl!.onerror = () => res();
          imgEl!.src = illustration;
        });
        if (imgEl.naturalWidth > 0) {
          const maxDim = CANVAS_W * 0.47;
          const scale = Math.min(maxDim / imgEl.naturalWidth, maxDim / imgEl.naturalHeight);
          iw = imgEl.naturalWidth * scale;
          ih = imgEl.naturalHeight * scale;
        }
      } catch {
        // continue without illustration
      }
    }

    // ── 2. Measure pass (temp canvas) ────────────────────────────
    const measure = document.createElement("canvas");
    measure.width = CANVAS_W;
    measure.height = 100;
    const mctx = measure.getContext("2d")!;
    mctx.direction = "rtl";

    const maxTextW = CANVAS_W - PAD - PAD_LEFT;
    const contextFontSize = FONT_SIZE_SECONDARY;
    const contextFont = `italic 400 ${contextFontSize}px SiteRegular, system-ui, Arial, sans-serif`;

    const contextLines = context ? wrapPlainText(mctx, context, maxTextW, contextFont) : [];
    const contextLineH = contextFontSize * 1.4;
    const contextH = contextLines.length > 0 ? contextLines.length * contextLineH + 36 : 0;

    const segments = parseSegments(quoteHtml);
    const lines = wrapSegments(mctx, segments, maxTextW);

    const lineH = FONT_SIZE * 1.45;
    const PRE_BOLD_GAP = FONT_SIZE * 0.5;

    // Total text height including gaps before bold lines
    let textH = 0;
    for (let i = 0; i < lines.length; i++) {
      if (i > 0 && lines[i][0]?.bold) textH += PRE_BOLD_GAP;
      textH += lineH;
    }

    // ── 3. Size canvas — text + illustration (if any) + footer zone ──
    const canvasH = Math.max(800, ih > 0
      ? Math.round(PAD + contextH + textH + 40 + ih + FOOTER_H)
      : Math.round(PAD + contextH + textH + 60 + PAD));
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    // ── 4. Clip to rounded rect, then white background ───────────
    const r = CORNER_RADIUS;
    ctx.beginPath();
    ctx.moveTo(0, 0);                                                    // top-left: sharp
    ctx.lineTo(CANVAS_W - r, 0);
    ctx.arcTo(CANVAS_W, 0, CANVAS_W, r, r);                             // top-right: rounded
    ctx.lineTo(CANVAS_W, canvasH - r);
    ctx.arcTo(CANVAS_W, canvasH, CANVAS_W - r, canvasH, r);             // bottom-right: rounded
    ctx.lineTo(r, canvasH);
    ctx.arcTo(0, canvasH, 0, canvasH - r, r);                           // bottom-left: rounded
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, canvasH);

    // ── 5. Illustration — above footer, PAD from left ────────────
    if (imgEl && iw > 0) {
      ctx.save();
      ctx.globalAlpha = 0.80;
      ctx.drawImage(imgEl, PAD, canvasH - FOOTER_H - ih, iw, ih);
      ctx.restore();
    }

    // ── 6. Context — small italic above quote ────────────────────
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    let y = PAD + contextFontSize * 0.85;

    if (contextLines.length > 0) {
      ctx.font = contextFont;
      ctx.fillStyle = INK_LIGHT;
      for (const line of contextLines) {
        ctx.fillText(line, CANVAS_W - PAD, y);
        y += contextLineH;
      }
      y += 36; // gap between context and quote
    } else {
      y = PAD + FONT_SIZE * 0.85;
    }

    // ── 6. Draw text — top aligned, with gap before bold lines ───
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.length) continue; // skip empty lines silently

      // Gap only when previous non-empty line was regular → current is bold
      const prevNonEmpty = [...lines].slice(0, i).reverse().find(l => l.length > 0);
      if (prevNonEmpty && line[0]?.bold && !prevNonEmpty[0]?.bold) {
        y += PRE_BOLD_GAP;
      }

      let x = CANVAS_W - PAD;
      for (const word of line) {
        ctx.font = fontStr(word.bold);
        ctx.fillStyle = word.bold ? ACCENT : INK;
        ctx.fillText(word.text, x, y);
        x -= ctx.measureText(word.text).width;
      }
      y += lineH;
    }

    // ── Attribution — fixed bottom-right, mirroring top PAD ──────
    if (ageLabel) {
      ctx.font = `400 ${FONT_SIZE_SECONDARY}px SiteRegular, system-ui, Arial, sans-serif`;
      ctx.fillStyle = INK_LIGHT;
      ctx.textAlign = "right";
      ctx.fillText(`— עפרי, ${ageLabel}`, CANVAS_W - PAD, canvasH - PAD);
    }

    // ── Watermark — fixed bottom-left, same baseline ──────────────
    ctx.font = `700 ${FONT_SIZE_SECONDARY}px SiteBold, system-ui, Arial, sans-serif`;
    ctx.fillStyle = INK_LIGHT;
    ctx.globalAlpha = 0.4;
    ctx.textAlign = "left";
    ctx.fillText("פקפק ✦", PAD, canvasH - PAD);
    ctx.globalAlpha = 1;

    // ── Export ───────────────────────────────────────────────────
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "ofri-quote.png", { type: "image/png" });
      try {
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      } catch {
        // fall through
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ofri-quote.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <button
      onClick={handleShare}
      title="שתף ציטוט"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.55,
        transition: "opacity 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>
  );
}
