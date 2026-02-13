import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const cardBase =
  "border p-6 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-800";

const DashboardHome = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user.name} 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {user.role === "storeOwner"
          ? "Manage your store, products and customer orders"
          : user.role === "superadmin"
          ? "Manage platform users, stores and analytics"
          : "Manage your orders, downloads and profile information"}
      </p>

      {/* ================= SUPERADMIN ================= */}
      {user.role === "superadmin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/superadmin" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              Platform Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              View total revenue, stores and system analytics
            </p>
          </Link>

          <Link to="/superadmin/users" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              Manage Users
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              View all users and store owners
            </p>
          </Link>
        </div>
      )}

      {/* ================= STORE OWNER ================= */}
      {user.role === "storeOwner" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/products" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              Manage Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Add, edit or remove store products
            </p>
          </Link>

          <Link to="/admin/orders" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              Store Orders
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              View and manage customer orders
            </p>
          </Link>

          <Link to="/admin/store-settings" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              Store Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Customize logo, banner and theme
            </p>
          </Link>
        </div>
      )}

      {/* ================= CUSTOMER ================= */}
      {user.role === "customer" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/orders" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              My Orders
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              View order status and history
            </p>
          </Link>

          <Link to="/dashboard/downloads" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              My Downloads
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Access purchased digital products
            </p>
          </Link>

          <Link to="/dashboard/profile" className={cardBase}>
            <h2 className="text-lg font-semibold mb-2">
              My Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Update account information
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
