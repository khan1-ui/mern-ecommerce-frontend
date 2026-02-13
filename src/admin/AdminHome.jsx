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

  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes] =
          await Promise.all([
            api.get("/api/store-owner/stats"),
            api.get("/api/store-owner/revenue"),
          ]);

        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
      } catch (err) {
        console.error("Dashboard load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  if (!stats) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data.
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
          value={stats.usersCount}
        />
        <StatCard
          title="Total Products"
          value={stats.products.total}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.total}
        />
        <StatCard
          title="Revenue"
          value={`৳ ${stats.revenue}`}
        />
      </div>

      {/* ================= BREAKDOWN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">
            Products Breakdown
          </h2>
          <p>Digital: {stats.products.digital}</p>
          <p>Physical: {stats.products.physical}</p>
        </div>

        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">
            Orders Status
          </h2>
          <p>Paid: {stats.orders.paid}</p>
          <p>Shipped: {stats.orders.shipped}</p>
          <p>Delivered: {stats.orders.delivered}</p>
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
      {revenueData.length > 0 && (
        <RevenueChart data={revenueData} />
      )}
    </div>
  );
};

export default AdminHome;
