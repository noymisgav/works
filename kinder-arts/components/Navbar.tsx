"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "בית", emoji: "🏠" },
  { href: "/artworks", label: "יצירות", emoji: "🎨" },
  { href: "/quotes", label: "הגיגים", emoji: "💬" },
  { href: "/stickers", label: "מדבקות", emoji: "⭐" },
  { href: "/soundtrack", label: "פסקול", emoji: "🎵" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.addEventListener("mousedown", toggleTheme);
    return () => btn.removeEventListener("mousedown", toggleTheme);
  }, [toggleTheme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-ofri.svg"
            alt="קינדר ארטס"
            className="h-12 w-auto group-hover:opacity-80 transition-opacity theme-logo"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-ink-light">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`hover:text-ink transition-colors ${active ? "font-black text-ink" : "font-medium"}`}
              >
                {label}
              </Link>
            );
          })}
          <button
            ref={btnRef}
            style={{
              ...theme.buttonStyle,
              border: "none",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          >
            {theme.label}
          </button>
        </div>

        {/* Mobile: theme button + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            ref={btnRef}
            style={{
              ...theme.buttonStyle,
              border: "none",
              borderRadius: "999px",
              padding: "5px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          >
            {theme.label}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-ink p-1"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border" style={{ background: "var(--cream)" }}>
          <div className="px-6 py-3 flex flex-col">
            {links.map(({ href, label, emoji }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`py-3 text-base border-b border-border last:border-0 hover:text-ink transition-colors flex items-center gap-3 ${
                    active ? "font-black text-ink" : "font-medium text-ink-light"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
