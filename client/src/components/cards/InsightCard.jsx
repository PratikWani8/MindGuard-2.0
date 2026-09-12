import { Sparkles } from "lucide-react";
import GlassCard from "../common/GlassCard";

export default function InsightCard({ title, body }) {
  return (
    <GlassCard strong className="relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-violet-200 to-aqua-200 opacity-50 blur-2xl" />
      <div className="relative flex gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center shrink-0">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">AI Insight</p>
          <h3 className="font-display font-semibold text-ink-900">{title}</h3>
          <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{body}</p>
        </div>
      </div>
    </GlassCard>
  );
}
