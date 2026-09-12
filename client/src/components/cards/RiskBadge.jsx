import { cn } from "../../utils/cn";

const levels = {
  stable: { label: "Stable", dot: "bg-calm-green", bg: "bg-green-50", text: "text-emerald-700" },
  attention: { label: "Needs attention", dot: "bg-calm-amber", bg: "bg-amber-50", text: "text-amber-700" },
  elevated: { label: "Elevated concern", dot: "bg-calm-orange", bg: "bg-orange-50", text: "text-orange-700" },
  urgent: { label: "Urgent support recommended", dot: "bg-calm-red", bg: "bg-red-50", text: "text-red-700" },
};

export default function RiskBadge({ level = "stable", size = "md" }) {
  const conf = levels[level] || levels.stable;
  const pad = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full font-semibold", conf.bg, conf.text, pad)}>
      <span className={cn("h-2 w-2 rounded-full", conf.dot)} />
      {conf.label}
    </span>
  );
}

export { levels as riskLevels };
