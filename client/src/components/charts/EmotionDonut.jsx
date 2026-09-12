import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const emotionColors = [
  "#7C3AED", // Purple
  "#F97316", // Orange
  "#10B981", // Green
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#EAB308", // Yellow
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

export default function EmotionDonut({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={3}
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={
                  entry.color ||
                  emotionColors[index % emotionColors.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e9e5f5",
              fontSize: 13,
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}