import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../store/cart";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const cartCount = cartItems.length;

  const logoutHandler = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav
      className="
        px-6 py-4 border-b
        bg-white text-black
        dark:bg-gray-900 dark:text-white
        transition-colors
      "
    >
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          E-Shop
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* DESKTOP MENU */}
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
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-red-600 font-semibold"
                >
                  Admin
                </Link>
              )}

              {user.role === "user" && (
                <Link to="/dashboard">Dashboard</Link>
              )}

              <span className="text-gray-600 dark:text-gray-200">
                Hi, {user.name}
              </span>

              <button
                onClick={logoutHandler}
                className="border px-3 py-1 rounded hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="border px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="border px-3 py-1 rounded text-sm"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div
          className="
            md:hidden mt-4
            flex flex-col gap-4
            text-sm font-medium
            border-t pt-4
          "
        >
          <Link onClick={() => setOpen(false)} to="/products">
            Products
          </Link>

          <Link onClick={() => setOpen(false)} to="/cart">
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  onClick={() => setOpen(false)}
                  to="/admin"
                  className="text-red-600"
                >
                  Admin
                </Link>
              )}

              {user.role === "user" && (
                <Link
                  onClick={() => setOpen(false)}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={logoutHandler}
                className="border px-3 py-1 rounded text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} to="/login">
                Login
              </Link>
              <Link onClick={() => setOpen(false)} to="/register">
                Register
              </Link>
            </>
          )}

          <button
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="border px-3 py-1 rounded text-left"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
