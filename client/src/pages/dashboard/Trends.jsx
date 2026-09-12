import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MultiTrendChart from "../../components/charts/MultiTrendChart";
import MoodTrendChart from "../../components/charts/MoodTrendChart";
import { fetchMoodTrend } from "../../services/checkinApi";
import { cn } from "../../utils/cn";

const ranges = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
];

export default function Trends() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTrend = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchMoodTrend(range);

        console.log("TREND RESPONSE:", response);

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
              "Failed to load trend data"
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
  }, [range]);

  return (
    <div className="space-y-6">
      <GlassCard
        strong
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="font-display text-xl font-semibold text-ink-900">
            Your wellbeing over time
          </p>

          <p className="text-sm text-ink-400 mt-1">
            Compare mood, stress, sleep and focus across recent check-ins.
          </p>
        </div>

        <div className="flex gap-1.5 bg-white/60 rounded-xl p-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={cn(
                "text-xs font-medium px-3.5 py-2 rounded-lg transition-colors",
                range === r.key
                  ? "bg-violet-500 text-white shadow-soft"
                  : "text-ink-500 hover:bg-white"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {loading ? (
        <LoadingSpinner label="Loading trend data" size="lg" />
      ) : error ? (
        <GlassCard>
          <div className="text-center py-10">
            <p className="text-sm font-semibold text-red-500">
              Unable to load trends
            </p>

            <p className="text-sm text-ink-400 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRange((current) => current)}
              className="mt-4 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm"
            >
              Try Again
            </button>
          </div>
        </GlassCard>
      ) : data.length === 0 ? (
        <GlassCard>
          <div className="text-center py-10">
            <p className="font-semibold text-ink-900">
              No trend data yet
            </p>

            <p className="text-sm text-ink-400 mt-2">
              Complete a few check-ins to see your wellbeing trends.
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          <GlassCard>
            <p className="font-display font-semibold text-ink-900 mb-3">
              Combined view
            </p>

            <MultiTrendChart data={data} />
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard>
              <p className="font-display font-semibold text-ink-900 mb-1">
                Stress trajectory
              </p>

              <p className="text-xs text-ink-400 mb-2">
                Higher values indicate more perceived stress.
              </p>

              <MoodTrendChart
                data={data}
                dataKey="stress"
                color="#e8823d"
                label="Stress"
              />
            </GlassCard>

            <GlassCard>
              <p className="font-display font-semibold text-ink-900 mb-1">
                Sleep vs mood correlation
              </p>

              <p className="text-xs text-ink-400 mb-2">
                Sleep hours often move ahead of mood shifts.
              </p>

              <MoodTrendChart
                data={data}
                dataKey="sleep"
                color="#3bb3c4"
                label="Sleep"
              />
            </GlassCard>
          </div>

          <GlassCard className="border border-amber-100 bg-amber-50/40">
            <p className="text-sm font-semibold text-amber-700">
              Anomaly detected
            </p>

            <p className="text-sm text-ink-500 mt-1">
              Stress rose sharply for 3 consecutive days while sleep dropped
              below your usual average - a pattern worth a short recovery
              break.
            </p>
          </GlassCard>
        </>
      )}
    </div>
  );
}