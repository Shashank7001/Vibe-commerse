import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("vibe_theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("vibe_theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return { theme, toggle };
}

export default function Navbar() {
  const location = useLocation();
  const { cart } = useCart();
  const { theme, toggle } = useTheme();

  const itemCount = cart?.items?.reduce((s, it) => s + (it.qty || 0), 0) || 0;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          VibeCommerce
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Products
          </Link>

          <Link to="/cart" className={`nav-link cart-link ${location.pathname === "/cart" ? "active" : ""}`}>
            Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          <Link to="/checkout" className={`nav-link ${location.pathname === "/checkout" ? "active" : ""}`}>
            Checkout
          </Link>

          <button aria-label="Toggle theme" className="btn" onClick={toggle}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}
