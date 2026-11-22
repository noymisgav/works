export type Theme = {
  id: string;
  label: string;
  cssVars: Record<string, string>;
  tintColors: string[];
  accordionColors: string[];
  invertImages: boolean;
  buttonStyle: { background: string; color: string };
};

export const themes: Theme[] = [
  {
    id: "classic",
    label: "✦ fun",
    accordionColors: ["#dcaeb9", "#f0b75f", "#88b8a2", "#899ccf", "#d77953"],
    cssVars: {
      "--cream":      "#F7F2EA",
      "--cream-muted":"#EDE8DF",
      "--card-bg":    "#FFFFFF",
      "--border":     "#E8E2D9",
      "--ink":        "#1A1A1A",
      "--ink-light":  "#5A5A5A",
      "--teal":       "#dcaeb9",
      "--teal-dark":  "#c49aaa",
      "--yellow":     "#f0b75f",
      "--coral":      "#d77953",
    },
    tintColors: ["#dcaeb9", "#f0b75f", "#899ccf", "#dc7657", "#88b8a2", "#899ccf", "#dcaeb9", "#88b8a2", "#f0b75f"],
    invertImages: false,
    buttonStyle: { background: "#1A1A1A", color: "#ffffff" },
  },
  {
    id: "fun",
    label: "✕ רגיל",
    accordionColors: ["#00e5ff", "#ffe600", "#ff3d9a", "#a855f7", "#00b8d4"],
    cssVars: {
      "--cream":      "#0d0b1a",
      "--cream-muted":"#080614",
      "--card-bg":    "#1a1630",
      "--border":     "#2e2a50",
      "--ink":        "#f0eaff",
      "--ink-light":  "#b0a8d8",
      "--teal":       "#00e5ff",
      "--teal-dark":  "#00b8d4",
      "--yellow":     "#ffe600",
      "--coral":      "#ff3d9a",
    },
    tintColors: ["#00e5ff", "#ffe600", "#ff3d9a", "#00b8d4", "#ffe600", "#ff3d9a", "#00e5ff", "#ffe600", "#ff3d9a"],
    invertImages: true,
    buttonStyle: { background: "linear-gradient(135deg, #00e5ff, #ff3d9a)", color: "#0d0b1a" },
  },
];

export const THEME_STORAGE_KEY = "theme-id";
export const defaultTheme = themes[0];

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) ?? defaultTheme;
}

export function nextTheme(current: Theme): Theme {
  const idx = themes.findIndex(t => t.id === current.id);
  return themes[(idx + 1) % themes.length];
}
