"use client";

import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#111827" : "#e2e8f0",
        color: theme === "light" ? "white" : "#111827",
      }}
    >
      Mode {theme === "light" ? "Gelap" : "Terang"}
    </button>
  );
}
