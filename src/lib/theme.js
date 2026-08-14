// src/lib/theme.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("mspixelpulse-theme");
  if (saved === "light" || saved === "dark") return saved;

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
    if (value !== "dark" && value !== "light") return;
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
