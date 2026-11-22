// Zero-dependency Telegram bot (uses Node.js 18+ built-in fetch)
// Load .env manually (no dotenv package needed)
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const wix = require("./wix");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error("Missing TELEGRAM_BOT_TOKEN in .env");

const TG = `https://api.telegram.org/bot${TOKEN}`;

const ALLOWED_USERS = process.env.ALLOWED_TELEGRAM_IDS
  ? process.env.ALLOWED_TELEGRAM_IDS.split(",").map(Number)
  : [];

// ─── Telegram API helpers ─────────────────────────────────────────────────────

async function tgCall(method, body = {}) {
  const res = await fetch(`${TG}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}

async function sendMessage(chatId, text, extra = {}) {
  return tgCall("sendMessage", { chat_id: chatId, text, ...extra });
}

async function downloadFile(fileId) {
  const file = await tgCall("getFile", { file_id: fileId });
  const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download file: ${res.status}`);
  const buf = await res.arrayBuffer();
  return { buffer: Buffer.from(buf), filePath: file.file_path };
}

// ─── Session state ────────────────────────────────────────────────────────────

const sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) sessions[chatId] = { step: "idle", data: {} };
  return sessions[chatId];
}

function setStep(chatId, step, data = {}) {
  sessions[chatId] = { step, data };
}

function clearSession(chatId) {
  delete sessions[chatId];
}

function isAllowed(userId) {
  return ALLOWED_USERS.length === 0 || ALLOWED_USERS.includes(userId);
}

function formatYearsList(years) {
  return years
    .map((y, i) => `${i + 1}. ${y.data.yearName || y.data.title || "?"}`)
    .join("\n");
}

// ─── Message handler ──────────────────────────────────────────────────────────

async function handleMessage(msg) {
  if (!msg) return;
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  const text = msg.text?.trim();
  const session = getSession(chatId);

  if (!isAllowed(userId)) return;

  try {
    // /start
    if (text === "/start") {
      return sendMessage(
        chatId,
        "שלום! 🎨 אני הבוט של אתר עפרי.\n\nאפשר לשלוח לי:\n📸 תמונה — יעלה לציורים\n/quote — יוסיף ציטוט\n🎵 קישור Spotify — יוסיף לפסקול\n/cancel — לביטול"
      );
    }

    // /cancel
    if (text === "/cancel") {
      clearSession(chatId);
      return sendMessage(chatId, "בוטל. ✓");
    }

    // /quote (only in idle) — also accepts typos and extra text after the command
    if ((text?.startsWith("/quote") || text?.startsWith("/qoute")) && session.step === "idle") {
      setStep(chatId, "quote_text");
      return sendMessage(chatId, "✍️ מה אמר עפרי? כתוב את הציטוט:");
    }

    // ── Spotify URL detection ─────────────────────────────────────────────────
    const spotifyMatch = text?.match(
      /https?:\/\/open\.spotify\.com\/(track|episode|show)\/[^\s]+/
    );
    if (spotifyMatch && session.step === "idle") {
      setStep(chatId, "song_type", { spotifyUrl: spotifyMatch[0] });
      return sendMessage(
        chatId,
        "🎵 קישור Spotify זוהה!\nמה הסוג?\nשלח: שיר  (או)  הסכת"
      );
    }

    // ── Photo ─────────────────────────────────────────────────────────────────
    if (msg.photo && session.step === "idle") {
      const photo = msg.photo[msg.photo.length - 1];
      const years = await wix.getKindergartenYears();
      setStep(chatId, "artwork_title", {
        fileId: photo.file_id,
        caption: msg.caption || "",
        years,
      });
      return sendMessage(
        chatId,
        "🎨 קיבלתי את הציור!\nמה שם הציור?\n(שלח /skip לשם אוטומטי)"
      );
    }

    // ── State steps ───────────────────────────────────────────────────────────

    if (session.step === "artwork_title") {
      const { fileId, caption, years } = session.data;
      const title =
        text === "/skip"
          ? `ציור של עפרי — ${new Date().toLocaleDateString("he-IL")}`
          : text;
      setStep(chatId, "artwork_year", { fileId, title, caption, years });
      const yearList = years.length
        ? `\n\nבאיזה שנת גן?\n${formatYearsList(years)}\n\nשלח מספר, שם שנה, או /skip.`
        : "\n\nשלח /skip לדלג על שנת הגן.";
      return sendMessage(chatId, `✅ כותרת: "${title}"${yearList}`);
    }

    if (session.step === "artwork_year") {
      const { fileId, title, caption, years } = session.data;
      let yearRef = null;
      if (text !== "/skip" && years.length) {
        const byIndex = parseInt(text) - 1;
        if (!isNaN(byIndex) && years[byIndex]) {
          yearRef = years[byIndex].id;
        } else {
          const match = years.find((y) =>
            (y.data.yearName || y.data.title || "")
              .toLowerCase()
              .includes(text.toLowerCase())
          );
          if (match) yearRef = match.id;
        }
      }
      setStep(chatId, "artwork_date", { fileId, title, caption, yearRef });
      return sendMessage(chatId, "📅 מתי נוצר הציור?\nכתוב תאריך (למשל: 12.3.2024) או /skip להיום.");
    }

    if (session.step === "artwork_date") {
      const { fileId, title, caption, yearRef } = session.data;
      let creationDate = new Date().toISOString();
      if (text !== "/skip") {
        // parse dd.mm.yyyy or dd/mm/yyyy
        const match = text.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
        if (match) {
          const [, d, m, y] = match;
          creationDate = new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`).toISOString();
        }
      }
      setStep(chatId, "artwork_comment", { fileId, title, caption, yearRef, creationDate });
      return sendMessage(chatId, "💬 הערת אמן? (שלח /skip לדלג)");
    }

    if (session.step === "artwork_comment") {
      const { fileId, title, caption, yearRef, creationDate } = session.data;
      const artistComment = text === "/skip" ? caption || "" : text;

      await sendMessage(chatId, "⏳ מעלה את הציור...");
      const { buffer, filePath } = await downloadFile(fileId);
      const ext = filePath.split(".").pop() || "jpg";
      const fileName = `ofri-artwork-${Date.now()}.${ext}`;
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";
      const wixImageUri = await wix.uploadImage(buffer, fileName, mimeType);

      await wix.createItem("artworks", {
        title,
        artworkImage: wixImageUri,
        creationDate,
        artistComment: artistComment || "",
        ...(yearRef ? { kindergartenyear: yearRef } : {}),
      });
      clearSession(chatId);
      return sendMessage(chatId, `✅ הציור "${title}" נשמר באתר! 🎉`);
    }

    if (session.step === "quote_text") {
      setStep(chatId, "quote_context", { quoteText: text });
      return sendMessage(chatId, "🌿 הקשר לציטוט? (שלח /skip לדלג)");
    }

    if (session.step === "quote_context") {
      const { quoteText } = session.data;
      const context = text === "/skip" ? "" : text;
      setStep(chatId, "quote_image", { quoteText, context });
      return sendMessage(chatId, "🖼️ יש איור לציטוט? שלחי תמונה, או /skip לדלג.");
    }

    if (session.step === "quote_image") {
      const { quoteText, context } = session.data;
      let illustrationUri = "";

      if (text === "/skip") {
        // no image
      } else if (msg.photo) {
        const photo = msg.photo[msg.photo.length - 1];
        const { buffer, filePath } = await downloadFile(photo.file_id);
        const ext = filePath.split(".").pop() || "jpg";
        const fileName = `ofri-quote-${Date.now()}.${ext}`;
        const mimeType = ext === "png" ? "image/png" : "image/jpeg";
        illustrationUri = await wix.uploadImage(buffer, fileName, mimeType);
      }

      await sendMessage(chatId, "⏳ שומר ציטוט...");
      await wix.createItem("BrilliantQuotes", {
        title: quoteText.slice(0, 60),
        quote: `<p>${quoteText}</p>`,
        context: context || "",
        date: new Date().toISOString(),
        ...(illustrationUri ? { illustration: illustrationUri } : {}),
      });
      clearSession(chatId);
      return sendMessage(chatId, `✅ הציטוט נשמר! 💬\n"${quoteText}"`);
    }

    if (session.step === "song_type") {
      const { spotifyUrl } = session.data;
      const type = text?.includes("שיר") ? "שיר" : "הסכת";
      setStep(chatId, "song_note", { spotifyUrl, type });
      return sendMessage(chatId, "📝 יש הערה של עפרי על השיר? (שלח /skip לדלג)");
    }

    if (session.step === "song_note") {
      const { spotifyUrl, type } = session.data;
      const ofriNote = text === "/skip" ? "" : text;
      await sendMessage(chatId, "⏳ שומר שיר...");
      await wix.createItem("songs", {
        spotifyUrl,
        type,
        ofriNote: ofriNote || "",
        date: new Date().toISOString(),
      });
      clearSession(chatId);
      return sendMessage(chatId, "✅ השיר נוסף לפסקול! 🎵");
    }

    // Unhandled in idle
    if (session.step === "idle") {
      sendMessage(
        chatId,
        "לא הבנתי 🤔\nשלח תמונה, קישור Spotify, או /quote לציטוט."
      );
    }
  } catch (err) {
    console.error("Error:", err.message);
    clearSession(chatId);
    sendMessage(chatId, `❌ שגיאה: ${err.message}`);
  }
}

// ─── Long polling ─────────────────────────────────────────────────────────────

let offset = 0;

async function poll() {
  try {
    const updates = await tgCall("getUpdates", {
      offset,
      timeout: 30,
      allowed_updates: ["message"],
    });
    for (const update of updates) {
      offset = update.update_id + 1;
      handleMessage(update.message).catch((e) =>
        console.error("Handler error:", e.message)
      );
    }
  } catch (err) {
    console.error("Poll error:", err.message);
    await new Promise((r) => setTimeout(r, 3000));
  }
  setImmediate(poll);
}

console.log("🤖 Kinder Arts bot is running...");
poll();
