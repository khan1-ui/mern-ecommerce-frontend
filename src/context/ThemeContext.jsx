import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const [storeColor, setStoreColor] = useState(
    () => localStorage.getItem("storeColor") || "#000000"
  );

  // 🔁 Dark / Light Sync
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🎨 Store Color Sync
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--store-color",
      storeColor
    );

    localStorage.setItem("storeColor", storeColor);
  }, [storeColor]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        storeColor,
        setStoreColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
