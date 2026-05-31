import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const THEME_STORAGE_KEY = "portfolio-theme";

function Layout() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Aditya Kumar. Built with React.</p>
      </footer>
    </>
  );
}

export default Layout;
