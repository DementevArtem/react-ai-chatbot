const THEME_KEY = "ai-chatbot-theme";

export const THEMES = [
  { id: "blue", label: "Blue", swatch: "#2d8fff" },
  { id: "teal", label: "Teal", swatch: "#14b8a6" },
  { id: "green", label: "Green", swatch: "#22c55e" },
  { id: "orange", label: "Orange", swatch: "#f59e0b" },
  { id: "dark", label: "Dark", swatch: "#1e293b" },
];

export function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return THEMES.some((theme) => theme.id === saved) ? saved : "blue";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.dataset.theme = theme;
}
