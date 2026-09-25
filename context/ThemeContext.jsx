/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "@/constants/lightTheme";
import darkTheme from "@/constants/darkTheme";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

const ThemeContext = createContext();
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [theme, setTheme] = useState(lightTheme);
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
  }, []);
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  // Apply theme helper
  const applyTheme = (mode) => {
    setThemeName(mode);
    setTheme(mode === "dark" ? darkTheme : lightTheme);
    document.documentElement.dataset.theme = mode;

    // Toggle class for Tailwind dark mode
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

  };
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  // Toggle theme
  const toggleThemeFun = () => {
    const newTheme = themeName === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleThemeFun }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
