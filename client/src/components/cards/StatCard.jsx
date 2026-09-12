import GlassCard from "../common/GlassCard";
import { cn } from "../../utils/cn";

export default function StatCard({ icon: Icon, label, value, unit, trend, accent = "violet" }) {
  const accents = {
    violet: "bg-violet-100 text-violet-600",
    aqua: "bg-cyan-100 text-cyan-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
  };
  return (
    <GlassCard className="p-5 flex items-center gap-4 animate-fade-up">
      <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0", accents[accent])}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-400 font-medium">{label}</p>
        <p className="font-display text-xl font-semibold text-ink-900 truncate">
          {value}
          {unit && <span className="text-sm text-ink-400 font-body font-medium ml-1">{unit}</span>}
        </p>
        {trend && <p className="text-xs text-ink-400 mt-0.5">{trend}</p>}
      </div>
    </GlassCard>
  );
}
