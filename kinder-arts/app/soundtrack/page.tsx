export const revalidate = 0;

import Navbar from "@/components/Navbar";
import HeroBg from "@/components/HeroBg";
import SoundtrackTimeline from "@/components/SoundtrackTimeline";
import { getSongs } from "@/lib/wix";
import type { Song } from "@/lib/types";

const demoSongs: Song[] = [
  {
    _id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    type: "שיר",
    date: "2024-11-01",
    spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    ofriNote: "השיר הכי טוב בעולם, שמעתי אותו כל יום",
    ofriNickname: "השיר של הריצה",
  },
  {
    _id: "2",
    title: "מה אתה רוצה",
    artist: "סטטיק ובן אל",
    type: "שיר",
    date: "2024-08-01",
    spotifyUrl: "https://open.spotify.com/track/1G391cbiT3v3Cywg8T7DM1",
    ofriNote: "רקדתי לזה עם אבא",
    ofriNickname: "השיר עם אבא",
  },
  {
    _id: "3",
    title: "As It Was",
    artist: "Harry Styles",
    type: "שיר",
    date: "2024-05-01",
    spotifyUrl: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7",
    ofriNote: "אמא אוהבת את זה גם",
  },
  {
    _id: "4",
    title: "מלך העולם",
    artist: "אביתר בנאי",
    type: "שיר",
    date: "2023-12-01",
    spotifyUrl: "https://open.spotify.com/track/6y0igZArWVi6Iz1rsjh4oL",
    ofriNote: "שרתי את זה כל הזמן",
    ofriNickname: "שיר המלך",
  },
  {
    _id: "5",
    title: "סיפורי בן גוריון",
    artist: "פודקאסט כאן",
    type: "הסכת",
    date: "2025-01-01",
    spotifyUrl: "https://open.spotify.com/episode/5NKkqDCLBNzGJ5qkFhgtaI",
    ofriNote: "ממש מעניין, למדתי על המדינה",
  },
];

export default async function SoundtrackPage() {
  const songs = await getSongs();
  const data = songs.length > 0 ? songs : demoSongs;

  return (
    <>
      <Navbar />
      <main className="bg-cream">
        {/* Hero */}
        <div
          className="relative py-16 text-center px-6 overflow-hidden"
          style={{ background: "var(--cream-muted)" }}
        >
          <HeroBg />
          <div className="relative z-10">
            <p className="text-teal font-bold text-sm tracking-widest uppercase mb-2">
              מוזיקה
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-ink">
              הפסקול של עפרי
            </h1>
            <p className="text-ink-light mt-3 text-lg font-normal">
              השירים וההסכתים שליוו את עפרי לאורך הדרך
            </p>
          </div>
        </div>
        <hr className="doodle-hr-dashed w-full" />

        <SoundtrackTimeline songs={data} />
      </main>
    </>
  );
}
