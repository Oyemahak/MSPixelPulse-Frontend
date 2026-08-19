// src/lib/theme.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
    favicon?.setAttribute(
      "href",
      theme === "dark"
        ? "/favicon-dark.svg?v=black-light-mark-v5"
        : "/favicon-light.svg?v=black-light-mark-v5"
    );

    window.localStorage.setItem("mspixelpulse-theme", theme);
  }, [theme]);

  const setTheme = useCallback((value) => {
    if (!validTheme(value)) return;
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
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
