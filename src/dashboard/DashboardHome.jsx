import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cardStyle } from "../styles";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user?.name || "User"} 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-100 mb-6">
        Manage your orders, downloads and profile information
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/dashboard/orders"
          className={cardStyle}
        >
          <h2 className="font-semibold text-lg">My Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-100">
            View order status & history
          </p>
        </Link>

        <Link
          to="/dashboard/downloads"
          className={cardStyle}
        >
          <h2 className="font-semibold text-lg">My Downloads</h2>
          <p className="text-sm text-gray-600 dark:text-gray-100">
            Access purchased digital products
          </p>
        </Link>

        <Link
          to="/dashboard/profile"
          className={cardStyle}
        >
          <h2 className="font-semibold text-lg">My Profile</h2>
          <p className="text-sm text-gray-600 dark:text-gray-100">
            Update account information
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
