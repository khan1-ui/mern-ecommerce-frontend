import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ always string: "light" | "dark"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // 🔁 sync with <html> + localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🌗 instant toggle
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
