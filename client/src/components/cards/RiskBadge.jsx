import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

const levelsConfig = {
  stable: { key: "risk.stable", defaultLabel: "Stable", dot: "bg-calm-green", bg: "bg-green-50 dark:bg-green-950/40", text: "text-emerald-700 dark:text-emerald-300" },
  attention: { key: "risk.attention", defaultLabel: "Needs attention", dot: "bg-calm-amber", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300" },
  elevated: { key: "risk.elevated", defaultLabel: "Elevated concern", dot: "bg-calm-orange", bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300" },
  urgent: { key: "risk.urgent", defaultLabel: "Urgent support recommended", dot: "bg-calm-red", bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300" },
};

export default function RiskBadge({ level = "stable", size = "md" }) {
  const { t } = useTranslation();
  const conf = levelsConfig[level] || levelsConfig.stable;
  const pad = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full font-semibold", conf.bg, conf.text, pad)}>
      <span className={cn("h-2 w-2 rounded-full", conf.dot)} />
      {t(conf.key, conf.defaultLabel)}
    </span>
  );
}

export { levelsConfig as riskLevels };
