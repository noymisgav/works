"use client";

import { useState, useRef } from "react";
import type { KindergartenYear } from "@/lib/types";

interface Props {
  years: KindergartenYear[];
}

export default function UploadClient({ years }: Props) {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [kindergartenYear, setKindergartenYear] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [artistComment, setArtistComment] = useState("");
  const [medium, setMedium] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Submit state ─────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // ── Password check ───────────────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-upload-password": password,
      },
      body: JSON.stringify({ mimeType: "image/png", fileName: "test.png" }),
    });
    if (res.ok || res.status === 502) {
      // 502 means auth passed but Wix call may have failed — still auth ok
      setAuthed(true);
    } else if (res.status === 401) {
      setAuthError("סיסמה שגויה. נסי שוב.");
    } else {
      setAuthed(true); // Any other error still means auth passed
    }
  };

  // ── File select ──────────────────────────────────────────────────────────────
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return;

    setStatus("uploading");
    setError("");

    try {
      // Step 1: get upload URL
      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify({ mimeType: file.type, fileName: file.name }),
      });

      if (!urlRes.ok) {
        const d = await urlRes.json();
        throw new Error(d.details || d.error || "Failed to get upload URL");
      }

      const { uploadUrl, uploadToken } = await urlRes.json();

      // Step 2: upload file directly to Wix
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          ...(uploadToken ? { Authorization: uploadToken } : {}),
        },
        body: file,
      });

      let artworkImage: string | undefined;
      if (putRes.ok) {
        const putData = await putRes.json().catch(() => null);
        // Wix returns the file info; extract the wix:image URI
        artworkImage =
          putData?.file?.url ||
          putData?.file?.wixMediaUrl ||
          putData?.url ||
          putData?.wixImageId ||
          undefined;
      }

      // Step 3: save artwork record
      setStatus("saving");
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const saveRes = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify({
          title,
          artworkImage,
          kindergartenYear: kindergartenYear || undefined,
          creationDate: creationDate || undefined,
          artistComment: artistComment || undefined,
          medium: medium || undefined,
          tags: tags.length ? tags : undefined,
        }),
      });

      if (!saveRes.ok) {
        const d = await saveRes.json();
        throw new Error(d.error || "Failed to save artwork");
      }

      setStatus("done");
      // Reset form
      setTitle("");
      setKindergartenYear("");
      setCreationDate("");
      setArtistComment("");
      setMedium("");
      setTagsInput("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    }
  };

  // ── Password gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black text-ink mb-2 text-center">העלאת יצירה</h1>
          <p className="text-ink-light text-sm text-center mb-8">אזור מוגן. הכניסי סיסמה.</p>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              autoFocus
              className="w-full border-2 border-ink rounded-xl px-4 py-3 text-center text-lg font-bold bg-white text-ink placeholder-ink/30 outline-none focus:border-[#dcaeb9] transition-colors"
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button
              type="submit"
              className="doodle-border font-black text-ink px-6 py-3 text-base hover-pink transition-colors"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Upload form ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-ink mb-2">העלאת יצירה</h1>
      <p className="text-ink-light mb-10">מלאי את הפרטים והעלי יצירה חדשה לגלריה</p>

      {status === "done" && (
        <div className="bg-[#88b8a2] text-white rounded-2xl px-6 py-4 mb-8 font-bold text-center">
          היצירה הועלתה בהצלחה! 🎨
          <button
            onClick={() => setStatus("idle")}
            className="block mx-auto mt-2 text-sm underline opacity-80 hover:opacity-100"
          >
            העלי יצירה נוספת
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[#d77953]/20 border-2 border-[#d77953] text-ink rounded-2xl px-6 py-4 mb-8">
          <p className="font-bold">שגיאה:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">תמונה *</label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-ink/30 rounded-2xl p-6 text-center cursor-pointer hover:border-[#dcaeb9] transition-colors bg-white"
          >
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                <p className="text-xs text-ink-light mt-2">{file?.name}</p>
              </div>
            ) : (
              <div className="text-ink-light">
                <p className="text-4xl mb-2">🖼️</p>
                <p className="font-bold">גררי תמונה לכאן או לחצי לבחירה</p>
                <p className="text-xs mt-1">PNG, JPG, WEBP</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">כותרת *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="שם היצירה"
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors"
          />
        </div>

        {/* Kindergarten year */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">שנת גן</label>
          <select
            value={kindergartenYear}
            onChange={(e) => setKindergartenYear(e.target.value)}
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors"
          >
            <option value="">בחרי שנה...</option>
            {years.map((y) => (
              <option key={y._id} value={y._id}>{y.title}</option>
            ))}
          </select>
        </div>

        {/* Creation date */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">תאריך יצירה</label>
          <input
            type="date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors"
          />
        </div>

        {/* Medium */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">חומרים / טכניקה</label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="למשל: גואש, פסטל, עפרונות..."
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors"
          />
        </div>

        {/* Artist comment */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">מה עפרי אמר על היצירה?</label>
          <textarea
            value={artistComment}
            onChange={(e) => setArtistComment(e.target.value)}
            placeholder="הערה של האמן..."
            rows={3}
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-ink mb-2">תגיות</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="בעלי חיים, צבעוני, גן... (מופרדים בפסיקים)"
            className="w-full border-2 border-ink/20 rounded-xl px-4 py-3 bg-white text-ink outline-none focus:border-[#dcaeb9] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={status === "uploading" || status === "saving" || !title || !file}
          className="doodle-border font-black text-ink px-8 py-4 text-base hover-pink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ transform: "rotate(-1deg)" }}
        >
          {status === "uploading" ? "מעלה תמונה..." : status === "saving" ? "שומרת..." : "העלי יצירה"}
        </button>
      </form>
    </div>
  );
}
