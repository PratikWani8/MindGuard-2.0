import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MultiTrendChart from "../../components/charts/MultiTrendChart";
import MoodTrendChart from "../../components/charts/MoodTrendChart";
import { fetchMoodTrend } from "../../services/checkinApi";
import { cn } from "../../utils/cn";

export default function Trends() {
  const { t } = useTranslation();
  const [range, setRange] = useState("7d");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ranges = [
    { key: "7d", label: t("trends.sevenDays") },
    { key: "30d", label: t("trends.thirtyDays") },
  ];

  useEffect(() => {
    let mounted = true;

    const loadTrend = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchMoodTrend(range);

        if (!mounted) return;

        // Handle different possible API response formats
        const trendData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.trends)
              ? response.trends
              : [];

        setData(trendData);
      } catch (err) {
        console.error("TREND API ERROR:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              t("trends.unableToLoad")
          );
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTrend();

    return () => {
      mounted = false;
    };
  }, [range, t]);

  return (
    <div className="space-y-6">
      <GlassCard
        strong
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">
            {t("trends.title")}
          </p>

          <p className="text-sm text-ink-400 dark:text-gray-400 mt-1">
            {t("trends.subtitle")}
          </p>
        </div>

        <div className="flex gap-1.5 bg-white/60 dark:bg-white/[0.06] rounded-xl p-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={cn(
                "text-xs font-medium px-3.5 py-2 rounded-lg transition-colors",
                range === r.key
                  ? "bg-violet-500 text-white shadow-soft"
                  : "text-ink-500 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {loading ? (
        <LoadingSpinner label={t("trends.loadingTrends")} size="lg" />
      ) : error ? (
        <GlassCard>
          <div className="text-center py-10">
            <p className="text-sm font-semibold text-red-500">
              {t("trends.unableToLoad")}
            </p>

            <p className="text-sm text-ink-400 dark:text-gray-400 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRange((current) => current)}
              className="mt-4 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm"
            >
              {t("common.tryAgain")}
            </button>
          </div>
        </GlassCard>
      ) : data.length === 0 ? (
        <GlassCard>
          <div className="text-center py-10">
            <p className="font-semibold text-ink-900 dark:text-white">
              {t("trends.noDataYet")}
            </p>

            <p className="text-sm text-ink-400 dark:text-gray-400 mt-2">
              {t("trends.noDataDesc")}
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          <GlassCard>
            <p className="font-display font-semibold text-ink-900 dark:text-white mb-3">
              {t("trends.combinedView")}
            </p>

            <MultiTrendChart data={data} />
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard>
              <p className="font-display font-semibold text-ink-900 dark:text-white mb-1">
                {t("trends.stressTrajectory")}
              </p>

              <p className="text-xs text-ink-400 dark:text-gray-400 mb-2">
                {t("trends.stressDesc")}
              </p>

              <MoodTrendChart
                data={data}
                dataKey="stress"
                color="#e8823d"
                label={t("trends.stress")}
              />
            </GlassCard>

            <GlassCard>
              <p className="font-display font-semibold text-ink-900 dark:text-white mb-1">
                {t("trends.sleepVsMood")}
              </p>

              <p className="text-xs text-ink-400 dark:text-gray-400 mb-2">
                {t("trends.sleepVsMoodDesc")}
              </p>

              <MoodTrendChart
                data={data}
                dataKey="sleep"
                color="#3bb3c4"
                label={t("trends.sleep")}
              />
            </GlassCard>
          </div>

          <GlassCard className="border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {t("trends.anomalyDetected")}
            </p>

            <p className="text-sm text-ink-500 dark:text-gray-300 mt-1">
              {t("trends.anomalyDesc")}
            </p>
          </GlassCard>
        </>
      )}
    </div>
  );
}