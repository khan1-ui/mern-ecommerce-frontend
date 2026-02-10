import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import AdminCharts from "./AdminCharts";
import RevenueChart from "./RevenueChart";
import {cardStyle}  from "../styles";



const StatCard = ({ title, value }) => (
  <div className="border rounded p-4 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ActionCard = ({ to, title, desc }) => (
  <Link
    to={to}
    className={cardStyle}
  >
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-600">{desc}</p>
  </Link>
);

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);

  const fetchRevenue = async () => {
  const { data } = await api.get("/admin/revenue");
  setRevenueData(data);
};
  useEffect(() => {
  fetchStats();
  fetchRevenue();
}, []);


  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 ">
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
          title="Total Revenue"
          value={`৳ ${stats.revenue}`}
        />
      </div>

      {/* ================= BREAKDOWN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">
            Products Breakdown
          </h2>
          <p>Digital: {stats.products.digital}</p>
          <p>Physical: {stats.products.physical}</p>
        </div>

        <div className="border rounded p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          to="/admin/users"
          title="Manage Users"
          desc="View registered users"
        />
      </div>
      {/* ================= CHARTS ================= */}
        <AdminCharts stats={stats} />
      {/* ================= REVENUE LINE CHART ================= */}
        {revenueData.length > 0 && (
         <RevenueChart data={revenueData} />
        )}


    </div>
  );
};

export default AdminHome;
