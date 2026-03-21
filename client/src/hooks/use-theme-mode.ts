import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

export const useThemeMode = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(STORAGE_KEY) === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem(STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  return {
    darkMode,
    toggleTheme: () => setDarkMode((value) => !value)
  };
};
