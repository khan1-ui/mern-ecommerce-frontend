import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import AdminCharts from "./AdminCharts";
import RevenueChart from "./RevenueChart";
import { useAuth } from "../context/AuthContext";
import { cardStyle } from "../styles";

const StatCard = ({ title, value }) => (
  <div className="border rounded p-4 text-center bg-white dark:bg-gray-800 shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ActionCard = ({ to, title, desc }) => (
  <Link to={to} className={cardStyle}>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      {desc}
    </p>
  </Link>
);

const AdminHome = () => {
  const { user } = useAuth();

  // ✅ Safe Initial State (Production Pattern)
  const [stats, setStats] = useState({
    storeExists: true,
    usersCount: 0,
    products: {
      total: 0,
      digital: 0,
      physical: 0,
    },
    orders: {
      total: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
    },
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          api.get("/api/store-owner/stats"),
          api.get("/api/store-owner/revenue"),
        ]);

        // ✅ Merge fallback structure
        setStats((prev) => ({
          ...prev,
          ...statsRes.data,
        }));

        setRevenueData(revenueRes.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  // ✅ If Store Not Created
  if (!stats?.storeExists) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          No Store Found
        </h2>

        <p className="text-gray-500 mb-6">
          You need to create a store before viewing the dashboard.
        </p>

        <Link
          to="/admin/create-store"
          className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
        >
          Create Store
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {user?.role === "storeOwner"
          ? "Store Dashboard"
          : "Admin Dashboard"}
      </h1>

      <p className="text-gray-500 mb-6 dark:text-gray-300">
        Overview of your store performance
      </p>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.usersCount ?? 0}
        />

        <StatCard
          title="Total Products"
          value={stats?.products?.total ?? 0}
        />

        <StatCard
          title="Total Orders"
          value={stats?.orders?.total ?? 0}
        />

        <StatCard
          title="Revenue"
          value={`৳ ${stats?.revenue ?? 0}`}
        />
      </div>

      {/* ================= BREAKDOWN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">
            Products Breakdown
          </h2>
          <p>Digital: {stats?.products?.digital ?? 0}</p>
          <p>Physical: {stats?.products?.physical ?? 0}</p>
        </div>

        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">
            Orders Status
          </h2>
          <p>Paid: {stats?.orders?.paid ?? 0}</p>
          <p>Shipped: {stats?.orders?.shipped ?? 0}</p>
          <p>Delivered: {stats?.orders?.delivered ?? 0}</p>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <h2 className="text-xl font-semibold mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <ActionCard
          to="/admin/products"
          title="Manage Products"
          desc="Add, edit or remove products"
        />

        <ActionCard
          to="/admin/orders"
          title="Manage Orders"
          desc="Update order status & delivery"
        />

        <ActionCard
          to="/admin/store-settings"
          title="Store Settings"
          desc="Customize logo, banner & theme"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <AdminCharts stats={stats} />

      {/* ================= REVENUE CHART ================= */}
      {revenueData?.length > 0 && (
        <RevenueChart data={revenueData} />
      )}
    </div>
  );
};

export default AdminHome;
