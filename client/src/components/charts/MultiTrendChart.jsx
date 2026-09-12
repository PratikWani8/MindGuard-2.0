import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const series = [
  {
    key: "mood",
    color: "#7c5ce6",
    label: "Mood",
  },
  {
    key: "stress",
    color: "#e8823d",
    label: "Stress",
  },
  {
    key: "sleep",
    color: "#3bb3c4",
    label: "Sleep",
  },
  {
    key: "focus",
    color: "#3fb886",
    label: "Focus",
  },
];

export default function MultiTrendChart({
  data = [],
  active = ["mood", "stress", "sleep", "focus"],
}) {
  const chartData = Array.isArray(data)
    ? data.map((item) => ({
        day: item.day,

        mood: Number(item.mood ?? 0),

        stress: Number(item.stress ?? 0),

        sleep: Number(item.sleep ?? 0),

        focus: Number(item.focus ?? 0),
      }))
    : [];

  console.log("MULTI TREND DATA:", chartData);

  if (!chartData.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-ink-400">
        No check-in data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -18,
            bottom: 0,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#ece7fb"
          />

          <XAxis
            dataKey="day"
            tick={{
              fontSize: 11,
              fill: "#87809e",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 10]}
            tick={{
              fontSize: 12,
              fill: "#87809e",
            }}
            axisLine={false}
            tickLine={false}
            width={28}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e9e5f5",
              fontSize: 13,
            }}
          />

          <Legend
            wrapperStyle={{
              fontSize: 12,
            }}
          />

          {series
            .filter((s) => active.includes(s.key))
            .map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.25}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}