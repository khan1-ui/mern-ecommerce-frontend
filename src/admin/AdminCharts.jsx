import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a"];

const AdminCharts = ({ stats }) => {
  const orderData = [
    { name: "Paid", value: stats.orders.paid },
    { name: "Shipped", value: stats.orders.shipped },
    { name: "Delivered", value: stats.orders.delivered },
  ];

  const productData = [
    { name: "Digital", value: stats.products.digital },
    { name: "Physical", value: stats.products.physical },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* ORDERS BAR CHART */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-4">
          Orders Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={orderData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PRODUCTS PIE CHART */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-4">
          Product Distribution
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={productData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {productData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
