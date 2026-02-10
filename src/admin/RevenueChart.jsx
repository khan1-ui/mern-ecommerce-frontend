import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data }) => {
  return (
    <div className="border rounded p-4 mt-10 ">
      <h2 className="font-semibold mb-4">
        Revenue Over Time
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`৳ ${value}`, "Revenue"]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
