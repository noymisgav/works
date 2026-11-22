export const revalidate = 0;

import Navbar from "@/components/Navbar";
import QuoteBook from "@/components/QuoteBook";
import HeroBg from "@/components/HeroBg";
import { getBrilliantQuotes } from "@/lib/wix";

export default async function QuotesPage() {
  const quotes = await getBrilliantQuotes();

  // Fallback demo content while CMS is empty
  const demoQuotes = [
    {
      _id: "1",
      title: "על סוכריות",
      quote: "סוכריה על מקל זה כמו ממתק על מקל, רק שזה סוכריה.",
      date: "2025-03-10",
    },
    {
      _id: "2",
      title: "על שינה",
      quote: "אני לא עייף. הגוף שלי עייף, אבל אני לא.",
      date: "2025-05-22",
    },
    {
      _id: "3",
      title: "על דינוזאורים",
      quote: "דינוזאורים נעלמו כי לא היה להם מזגן.",
      date: "2025-08-01",
    },
    {
      _id: "4",
      title: "על אהבה",
      quote: "אני אוהב אותך עד הירח ובחזרה. אבל לא יותר מזה.",
      date: "2025-09-14",
    },
    {
      _id: "5",
      title: "על אוכל",
      quote: "אני לא אוכל ירוק. ירוק זה צבע, לא אוכל.",
      date: "2025-11-03",
    },
  ];

  const data = quotes.length > 0 ? quotes : demoQuotes;

  return (
    <>
      <Navbar />
      <main className="bg-cream">
        {/* Hero */}
        <div className="relative py-16 text-center px-6 overflow-hidden" style={{ background: "var(--cream-muted)" }}>
          <HeroBg />
          <div className="relative z-10">
            <p className="text-teal font-bold text-sm tracking-widest uppercase mb-2">
              ספר הציטוטים
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-ink">
              עפרי אמר מה?
            </h1>
            <p className="text-ink-light mt-3 text-lg font-normal">
              דברים גאוניים שעפריקי אמר ואי אפשר היה להמציא אותם לבד
            </p>
          </div>
        </div>
        <hr className="doodle-hr-dashed w-full" />

        <QuoteBook quotes={data} />
      </main>
    </>
  );
}
