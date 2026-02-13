import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/superadmin/stats");

        setStats((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error("Failed to load superadmin stats", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Super Admin Dashboard
      </h1>

      <p className="text-gray-500 mb-8 dark:text-gray-300">
        Platform-wide overview and analytics
      </p>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Total Stores" value={stats?.totalStores ?? 0} />
        <StatCard title="Active Stores" value={stats?.activeStores ?? 0} />
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard
          title="Total Revenue"
          value={`৳ ${stats?.totalRevenue?.toLocaleString() ?? 0}`}
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/superadmin/users"
            className="px-5 py-2 bg-black text-white rounded hover:opacity-90 transition"
          >
            Manage Users
          </Link>

          <Link
            to="/superadmin/stores"
            className="px-5 py-2 bg-gray-800 text-white rounded hover:opacity-90 transition"
          >
            Manage Stores
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
