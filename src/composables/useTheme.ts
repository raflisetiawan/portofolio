import { onMounted, readonly, ref } from "vue";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const THEME_COLORS: Record<Theme, string> = { dark: "#0e1412", light: "#f6f7f4" };

// Shared across components. Starts dark to match the prerendered page, then syncs on mount.
const theme = ref<Theme>("dark");

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
  // The inline script in index.html has already applied the saved choice before first paint.
  onMounted(() => {
    theme.value = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  });
  return { theme: readonly(theme), toggleTheme };
}
