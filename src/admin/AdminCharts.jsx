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
  CartesianGrid,
  Legend,
} from "recharts";

const DEFAULT_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
];

const AdminCharts = ({ stats, themeColor = "#000000" }) => {
  if (!stats) return null;

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
      
      {/* ================= ORDERS BAR CHART ================= */}
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-4">
          Orders Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={themeColor}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PRODUCTS PIE CHART ================= */}
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-4">
          Product Distribution
        </h2>

        {productData.every((item) => item.value === 0) ? (
          <p className="text-gray-500 text-center">
            No product data available.
          </p>
        ) : (
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
                    fill={
                      DEFAULT_COLORS[
                        index % DEFAULT_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminCharts;
