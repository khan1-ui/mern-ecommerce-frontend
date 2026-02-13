import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SuperAdminNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="px-6 py-4 border-b bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex justify-between items-center">
        <Link to="/superadmin" className="text-xl font-bold">
          Platform Admin
        </Link>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/superadmin">Dashboard</Link>
          <Link to="/superadmin/users">Users</Link>
          <Link to="/superadmin/stores">Stores</Link>
          <Link to="/superadmin/products">Products</Link>

          <span className="text-gray-600 dark:text-gray-200">
            Hi, {user?.name}
          </span>

          <button
            onClick={logout}
            className="border px-3 py-1 rounded hover:bg-black hover:text-white transition"
          >
            Logout
          </button>

          <button onClick={toggleTheme} className="border px-3 py-1 rounded">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </nav>
  );
}
