import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">NeonFlix</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/top-rated"
              className={`nav-link ${isActive("/top-rated") ? "active" : ""}`}
            >
              Mejor Valoradas
            </Link>
          </li>
          <li>
            <Link
              to="/upcoming"
              className={`nav-link ${isActive("/upcoming") ? "active" : ""}`}
            >
              Estrenos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
