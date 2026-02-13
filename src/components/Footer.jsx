import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer
      className="
        border-t
        bg-white text-gray-700
        dark:bg-gray-900 dark:text-gray-400
        transition-colors
      "
    >
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            E-Commerce SaaS
          </h3>
          <p className="mt-1">
            Multi-Store Digital & Physical Marketplace
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="font-medium text-black dark:text-white mb-1">
            Quick Links
          </p>
          <ul className="space-y-1">
            <li>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
            </li>

            {user && user.role === "storeOwner" && (
              <li>
                <Link to="/dashboard" className="hover:underline">
                  Store Dashboard
                </Link>
              </li>
            )}

            {user && user.role === "superadmin" && (
              <li>
                <Link to="/superadmin" className="hover:underline">
                  Super Admin
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Copyright */}
        <div className="md:text-right">
          <p>
            © {new Date().getFullYear()} SaaS Platform
          </p>
          <p className="mt-1 text-xs">
            Built with MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
