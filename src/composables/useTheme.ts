import { readonly, ref } from "vue";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const THEME_COLORS: Record<Theme, string> = { dark: "#0e1412", light: "#f6f7f4" };

// Shared across components. The inline script in index.html has already applied
// the saved choice before first paint, so the document is the source of truth here.
const theme = ref<Theme>(document.documentElement.dataset.theme === "light" ? "light" : "dark");

function toggleTheme() {
  const next: Theme = theme.value === "dark" ? "light" : "dark";
  theme.value = next;
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be blocked. The toggle still works for this visit.
  }
}

export function useTheme() {
  return { theme: readonly(theme), toggleTheme };
}
