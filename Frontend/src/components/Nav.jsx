
import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../config/content.js";
import { useAuth } from "../services/AuthContext.jsx";
import { roleHome } from "../config/roles.js";

// Preserve your original logo structure and CSS.
export const Logo = () => (
  <Link to="/" className="logo">
    <span>K</span>
    {BRAND.name}
  </Link>
);

export default function Nav() {
  const { user } = useAuth();

  return (
    <header className="nav glass-card">
      <Logo />

      <nav>
        <NavLink to="/extension">
          Extension
        </NavLink>

        <Link
          className="btn sm"
          to={user ? roleHome(user.role) : "/auth"}
        >
          {user ? "Dashboard" : "Sign in"}
        </Link>
      </nav>
    </header>
  );
}
