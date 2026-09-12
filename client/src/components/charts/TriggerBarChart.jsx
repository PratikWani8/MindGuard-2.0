import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const palette = [
  "#7c5ce6",
  "#9679f0",
  "#b6a5f7",
  "#5ecbd8",
  "#3bb3c4",
];

export default function TriggerBarChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="#ece7fb"
          />

          <XAxis
            type="number"
            tick={{
              fontSize: 11,
              fill: "#87809e",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{
              fontSize: 12,
              fill: "#5d5578",
            }}
            axisLine={false}
            tickLine={false}
            width={90}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e9e5f5",
              fontSize: 13,
            }}
          />

          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`${entry.name || "trigger"}-${index}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}