"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { themes, defaultTheme, getThemeById, nextTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/themes";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Clear all possible CSS vars from all themes
  themes.forEach(t => Object.keys(t.cssVars).forEach(k => root.style.removeProperty(k)));
  // Apply this theme's vars
  Object.entries(theme.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));
  // Set data-theme for CSS selectors
  root.setAttribute("data-theme", theme.id);
}

export const THEME_CHANGE_EVENT = "theme-change";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) ?? "classic";
    const t = getThemeById(saved);
    setThemeState(t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(current => {
      const next = nextTheme(current);
      localStorage.setItem(THEME_STORAGE_KEY, next.id);
      applyTheme(next);
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next.id }));
      return next;
    });
  }, []);

  // Keep in sync if another component triggers the event
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setThemeState(getThemeById(id));
    };
    window.addEventListener(THEME_CHANGE_EVENT, handler);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
