import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MoodTrendChart({
  data = [],
  dataKey = "mood",
  color = "#7c5ce6",
  label = "Mood",
}) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={Array.isArray(data) ? data : []}
          margin={{
            top: 10,
            right: 10,
            left: -18,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id={`grad-${dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={color}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={color}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="#ece7fb"
          />

          <XAxis
            dataKey="day"
            tick={{
              fontSize: 12,
              fill: "#87809e",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
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
            labelStyle={{
              color: "#3b2676",
              fontWeight: 600,
            }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}