import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ data = [], color = "#000000" }) => {
  if (!data.length) {
    return (
      <div className="border rounded p-4 mt-10 text-center text-gray-500">
        No revenue data available.
      </div>
    );
  }

  return (
    <div className="border rounded p-4 mt-10 bg-white dark:bg-gray-900">
      <h2 className="font-semibold mb-4">
        Revenue Over Time
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            }
          />

          <YAxis />

          <Tooltip
            formatter={(value) => [`৳ ${value}`, "Revenue"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString()
            }
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
