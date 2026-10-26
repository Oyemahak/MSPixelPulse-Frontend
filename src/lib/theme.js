// src/lib/theme.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

const PENDING_ACCOUNT_THEME_KEY = "mspixelpulse-account-theme-pending";

function validTheme(value) {
  return value === "light" || value === "dark";
}

export function rememberPendingAccountTheme(userId, theme) {
  if (typeof window === "undefined" || !userId || !validTheme(theme)) return;

  window.localStorage.setItem(
    PENDING_ACCOUNT_THEME_KEY,
    JSON.stringify({ userId: String(userId), theme }),
  );
}

export function getPendingAccountTheme(userId) {
  if (typeof window === "undefined" || !userId) return "";

  try {
    const pending = JSON.parse(
      window.localStorage.getItem(PENDING_ACCOUNT_THEME_KEY) || "null",
    );

    if (String(pending?.userId || "") !== String(userId)) return "";
    return validTheme(pending?.theme) ? pending.theme : "";
  } catch {
    return "";
  }
}

export function clearPendingAccountTheme(userId, theme) {
  if (typeof window === "undefined") return;

  const pending = getPendingAccountTheme(userId);
  if (!pending || (theme && pending !== theme)) return;

  window.localStorage.removeItem(PENDING_ACCOUNT_THEME_KEY);
}

// Crossfades the page between themes where the View Transitions API exists.
// The attribute and React state are both committed inside the transition so
// the "after" snapshot already shows the new palette. Without support, with
// reduced motion, or in a background tab, the theme switches instantly.
function crossfadeTheme(next, commit) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (typeof document.startViewTransition !== "function" || reduceMotion || document.hidden) {
    commit();
    return;
  }

  document.startViewTransition(() => {
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    flushSync(commit);
  });
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("mspixelpulse-theme");
  if (validTheme(saved)) return saved;

  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Write to <html> + localStorage whenever it changes.
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "dark" ? "#030304" : "#f6f8fc");

    const favicon = document.querySelector("#site-favicon");
    favicon?.setAttribute("href", "/favicon.svg?v=white-tile-v11");

    window.localStorage.setItem("mspixelpulse-theme", theme);
  }, [theme]);

  const setTheme = useCallback((value) => {
    if (!validTheme(value)) return;
    if (value === document.documentElement.getAttribute("data-theme")) {
      setThemeState(value);
      return;
    }
    crossfadeTheme(value, () => setThemeState(value));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    crossfadeTheme(next, () => setThemeState(next));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme]);

  return React.createElement(
    ThemeContext.Provider,
    {
      value,
    },
    children
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
