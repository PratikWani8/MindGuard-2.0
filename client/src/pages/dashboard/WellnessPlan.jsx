import { useEffect, useState } from "react";
import { Wind, Leaf, Moon, PenLine, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchTodayPlan, fetchRecommendations, toggleWellnessItem } from "../../services/wellnessApi";
import { cn } from "../../utils/cn";

const typeIcon = { breathing: Wind, mindfulness: Leaf, sleep: Moon, journal: PenLine };

export default function WellnessPlan() {
  const { t } = useTranslation();
  const [plan, setPlan] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTodayPlan(), fetchRecommendations()]).then(([p, r]) => {
      setPlan(p); setRecs(r); setLoading(false);
    });
  }, []);

  const toggle = async (id) => {
    setPlan((p) => ({
      ...p,
      completion: p.items.find((i) => i.id === id).done ? p.completion - 1 : p.completion + 1,
      items: p.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }));
    await toggleWellnessItem(id);
  };

  if (loading) return <LoadingSpinner label={t("wellness.buildingPlan")} size="lg" />;

  const pct = Math.round((plan.completion / plan.total) * 100);

  return (
    <div className="space-y-6">
      <GlassCard strong className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#ece7fb" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#pgrad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - pct / 100)}
            />
            <defs>
              <linearGradient id="pgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c5ce6" />
                <stop offset="100%" stopColor="#3bb3c4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display font-semibold text-ink-900 dark:text-white">
            {pct}%
          </div>
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">
            {t("wellness.title")}
          </p>
          <p className="text-sm text-ink-400 dark:text-gray-400 mt-1">
            {t("wellness.subtitle", { completion: plan.completion, total: plan.total })}
          </p>
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {plan.items.map((item) => {
          const Icon = typeIcon[item.type] || Leaf;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="text-left focus-ring rounded-3xl"
            >
              <GlassCard className={cn("flex items-center gap-4 transition-colors", item.done && "bg-emerald-50/60 dark:bg-emerald-950/40")}>
                <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0", item.done ? "bg-emerald-500 text-white" : "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300")}>
                  {item.done ? <Check size={19} /> : <Icon size={19} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", item.done ? "text-ink-400 dark:text-gray-500 line-through" : "text-ink-800 dark:text-gray-100")}>{item.title}</p>
                  <p className="text-xs text-ink-300 dark:text-gray-400 capitalize">{item.type}</p>
                </div>
              </GlassCard>
            </button>
          );
        })}
      </div>

      <p className="font-display font-semibold text-ink-900 dark:text-white px-1">
        {t("wellness.moreRecommendations")}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {recs.map((r) => {
          const Icon = typeIcon[r.type] || Leaf;
          return (
            <GlassCard key={r.id} strong>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-2xl bg-aqua-400/20 text-aqua-500 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-800 dark:text-gray-100">{r.title}</p>
                  <p className="text-xs text-ink-400 dark:text-gray-400">{r.duration}</p>
                </div>
              </div>
              <p className="text-xs text-ink-500 dark:text-gray-300 leading-relaxed">{r.description}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
