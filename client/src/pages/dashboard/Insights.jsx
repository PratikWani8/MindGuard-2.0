import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import RiskBadge from "../../components/cards/RiskBadge";
import EmotionDonut from "../../components/charts/EmotionDonut";
import TriggerBarChart from "../../components/charts/TriggerBarChart";

import {
  fetchWellbeingStatus,
  fetchDailyInsight,
  fetchThemesAndEmotions,
} from "../../services/insightApi";

export default function Insights() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [insight, setInsight] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [
          statusData,
          insightData,
          patternsData,
        ] = await Promise.all([
          fetchWellbeingStatus(),
          fetchDailyInsight(),
          fetchThemesAndEmotions(),
        ]);

        setStatus(statusData);
        setInsight(insightData);
        setPatterns(patternsData);
      } catch (error) {
        console.error(
          "Failed to load insights:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        label={t("common.loading")}
        size="lg"
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* Current status */}
      <GlassCard
        strong
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-500 mb-1">
            {t("insights.currentStatus")}
          </p>

          <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
            {status?.summary || t("insights.noData")}
          </h2>
        </div>

        <RiskBadge
          level={status?.level || "stable"}
          size="lg"
        />
      </GlassCard>

      {/* Emotional patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <p className="font-display font-semibold text-ink-900 dark:text-white mb-3">
            {t("insights.emotionalPatterns")}
          </p>

          {patterns?.emotions?.length > 0 ? (
            <EmotionDonut
              data={patterns.emotions}
            />
          ) : (
            <p className="text-sm text-ink-400 dark:text-gray-400">
              {t("insights.noEmotionData")}
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <p className="font-display font-semibold text-ink-900 dark:text-white mb-3">
            {t("insights.commonTriggers")}
          </p>

          {patterns?.triggers?.length > 0 ? (
            <TriggerBarChart
              data={patterns.triggers}
            />
          ) : (
            <p className="text-sm text-ink-400 dark:text-gray-400">
              {t("insights.noTriggerData")}
            </p>
          )}
        </GlassCard>
      </div>

      {/* Themes and recent change */}
      <div className="grid md:grid-cols-2 gap-6">

        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Tag
              size={18}
              className="text-violet-600 dark:text-violet-400"
            />

            <p className="font-display font-semibold text-ink-900 dark:text-white">
              {t("insights.recurringThemes")}
            </p>
          </div>

          {patterns?.themes?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patterns.themes.map((theme) => (
                <span
                  key={theme}
                  className="text-xs bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400 dark:text-gray-400">
              {t("insights.noThemesDetected")}
            </p>
          )}
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {status?.level === "elevated" ? (
                <TrendingUp
                  size={18}
                  className="text-calm-orange"
                />
              ) : (
                <TrendingDown
                  size={18}
                  className="text-calm-green"
                />
              )}

              <p className="font-display font-semibold text-ink-900 dark:text-white">
                {t("insights.recentPattern")}
              </p>
            </div>

            {status?.trends?.length >= 2 ? (
              <p className="text-sm text-ink-500 dark:text-gray-300">
                {t("insights.basedOnLatest", {
                  count: Math.min(status.trends.length, 4)
                })}{" "}
                <span className="font-medium text-ink-800 dark:text-gray-100">
                  {status.level || "stable"}
                </span>
                .
              </p>
            ) : (
              <p className="text-sm text-ink-400 dark:text-gray-400">
                {t("insights.moreCheckinsNeeded")}
              </p>
            )}
          </div>
        </GlassCard>

      </div>

      {/* AI insight */}
      <GlassCard
        strong
        className="relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200 to-aqua-200 opacity-50 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center shrink-0">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="font-display font-semibold text-ink-900 dark:text-white">
                {insight?.title || t("insights.aiInsight")}
              </p>

              <p className="text-sm text-ink-500 dark:text-gray-300 mt-1 max-w-xl leading-relaxed">
                {insight?.body || t("insights.defaultInsight")}
              </p>
            </div>
          </div>

          <Button
            as={Link}
            to="/dashboard/wellness-plan"
            className="shrink-0"
          >
            {t("insights.viewYourPlan")}
            <ArrowRight size={16} />
          </Button>

        </div>
      </GlassCard>

      <p className="text-xs text-ink-300 dark:text-gray-500 text-center">
        {t("insights.disclaimer")}
      </p>
    </div>
  );
}