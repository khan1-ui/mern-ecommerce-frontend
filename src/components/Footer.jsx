const Footer = () => {
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
            E-Shop
          </h3>
          <p className="mt-1">
            Digital & Physical Products Marketplace
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="font-medium text-black dark:text-white mb-1">
            Quick Links
          </p>
          <ul className="space-y-1">
            <li>Products</li>
            <li>Dashboard</li>
            <li>Admin Panel</li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="md:text-right">
          <p>
            © {new Date().getFullYear()} Digital Commerce
          </p>
          <p className="mt-1 text-xs">
            Built with React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
