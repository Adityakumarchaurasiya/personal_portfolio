import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const THEME_STORAGE_KEY = "portfolio-theme";

function Layout() {
  const [theme, setTheme] = useState("light");
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Track page scroll percentage to fill/empty the vertical line from top to bottom
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      {/* Interactive Vertical Scroll Line (Neon Cyberpunk Gradient with Glowing Lead Dot) */}
      <div className="vertical-scroll-track">
        <div
          className="vertical-scroll-fill"
          style={{
            height: `${scrollProgress}%`,
          }}
        />
      </div>

      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
      <Footer scrollProgress={scrollProgress} />
    </>
  );
}

export default Layout;
