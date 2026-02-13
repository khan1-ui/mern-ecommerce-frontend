import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function CustomerNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const cartCount = cart?.length || 0;

  return (
    <nav className="px-6 py-4 border-b bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          E-Shop
        </Link>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products">Products</Link>

          <Link to="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span className="text-gray-600 dark:text-gray-200">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="border px-3 py-1 rounded hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="border px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}

          <button onClick={toggleTheme} className="border px-3 py-1 rounded">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm border-t pt-4">
          <Link onClick={() => setOpen(false)} to="/products">
            Products
          </Link>
          <Link onClick={() => setOpen(false)} to="/cart">
            Cart ({cartCount})
          </Link>
        </div>
      )}
    </nav>
  );
}
