"use client";
import React, { useEffect, useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { themeName, toggleThemeFun } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Keep the server markup identical to the first client render. The theme is
  // restored from storage after mount, so the toggle never causes hydration
  // warnings when the saved theme differs from the server default.
  const isDark = mounted && themeName === "dark";

  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <button
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleThemeFun}
        className="site-icon-button"
      >
        {isDark ? (
          <BsSun size={17} color="var(--gold)" />
        ) : (
          <BsMoon size={17} color="var(--gold)" />
        )}
      </button>
    </motion.div>
  );
};

export default ThemeToggle;
