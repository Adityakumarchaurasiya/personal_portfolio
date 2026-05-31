import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sectionLinks = [
  { label: "Home", to: "/home" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Creator", to: "/creator" },
  { label: "Services", to: "/services" },
];

function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!open) return undefined;

    const onResize = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-wrap">
      <nav className="navbar section-inner">
        <Link to="/home" className="brand" onClick={closeMenu}>
          Aditya Kumar
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {sectionLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            {isAuthenticated ? (
              <NavLink to="/admin" onClick={closeMenu}>
                Admin
              </NavLink>
            ) : (
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
            )}
          </li>
        </ul>

        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
