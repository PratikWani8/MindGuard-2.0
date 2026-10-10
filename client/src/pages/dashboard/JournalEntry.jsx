import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Tag,
  Brain,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmotionDonut from "../../components/charts/EmotionDonut";

import {
  fetchJournalById,
  analyzeJournal,
} from "../../services/journalApi";

const emotionColors = [
  "#e8823d",
  "#e85d5d",
  "#7c9ce6",
  "#e8a53d",
  "#3fb886",
  "#9679f0",
];

export default function JournalEntry() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();

  const [entry, setEntry] = useState(
    location.state?.draft || null
  );

  const [loading, setLoading] = useState(
    !location.state?.draft
  );

  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEntry = async () => {
      try {
        const data = await fetchJournalById(id);

        if (!active) return;

        if (data) {
          setEntry(data);
        }
      } catch (error) {
        console.error(
          "Failed to load journal:",
          error
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEntry();

    return () => {
      active = false;
    };
  }, [id]);

  const runAnalysis = async () => {
    setAnalyzing(true);

    try {
      const result = await analyzeJournal(id);

      setEntry(result);
    } catch (error) {
      console.error(
        "Journal AI analysis failed:",
        error
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        label={t("common.loading")}
        size="lg"
      />
    );
  }

  if (!entry) {
    return (
      <GlassCard>
        {t("journal.noEntriesFound")}
      </GlassCard>
    );
  }

  const emotionData = (
    entry.emotions || []
  ).map((emotion, index) => ({
    ...emotion,
    color:
      emotionColors[
        index % emotionColors.length
      ],
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <Link
        to="/dashboard/journal/history"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-violet-600 dark:hover:text-violet-400"
      >
        <ArrowLeft size={16} />
        {t("journal.backToHistory")}
      </Link>

      {/* Journal */}
      <GlassCard strong>
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-300 dark:text-gray-500">
            {entry.date}
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white mt-1">
          {entry.title}
        </h1>

        <p className="text-ink-600 dark:text-gray-200 leading-relaxed mt-4 whitespace-pre-line">
          {entry.content}
        </p>
      </GlassCard>

      {/* Analyze button */}
      {!entry.analyzed && !analyzing && (
        <GlassCard className="text-center py-8">
          <Sparkles
            className="mx-auto text-violet-400 mb-2"
            size={26}
          />

          <p className="text-ink-500 dark:text-gray-400 text-sm mb-4">
            {t("journal.notAnalyzedYet")}
          </p>

          <Button onClick={runAnalysis}>
            <Sparkles size={16} />
            {t("journal.analyzeWithAi")}
          </Button>
        </GlassCard>
      )}

      {/* Loading */}
      {analyzing && (
        <LoadingSpinner
          label={t("journal.analyzingWithAi")}
          size="lg"
        />
      )}

      {/* AI result */}
      {entry.analyzed && !analyzing && (
        <div className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            {/* Emotion */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Brain
                  size={18}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="font-display font-semibold text-ink-900 dark:text-white">
                  {t("journal.emotionBreakdown")}
                </p>
              </div>

              {emotionData.length > 0 ? (
                <EmotionDonut data={emotionData} />
              ) : (
                <p className="text-sm text-ink-400 dark:text-gray-500">
                  {t("journal.noEmotionData")}
                </p>
              )}
            </GlassCard>

            {/* Themes */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Tag
                  size={17}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="font-display font-semibold text-ink-900 dark:text-white">
                  {t("journal.detectedThemes")}
                </p>
              </div>

              {entry.themes?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {entry.themes.map((theme) => (
                    <span
                      key={theme}
                      className="text-xs bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400 dark:text-gray-500">
                  {t("journal.noThemesDetected")}
                </p>
              )}
            </GlassCard>

          </div>

          {/* Sentiment */}
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400 dark:text-gray-500">
                  {t("journal.overallSentiment")}
                </p>

                <p className="font-display text-xl font-semibold text-ink-900 dark:text-white capitalize mt-1">
                  {entry.sentiment}
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                  entry.sentiment === "positive"
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                    : entry.sentiment === "negative"
                    ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {entry.sentiment}
              </div>
            </div>
          </GlassCard>

          {/* AI Insight */}
          <GlassCard strong>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles
                size={17}
                className="text-violet-600 dark:text-violet-400"
              />

              <p className="font-display font-semibold text-ink-900 dark:text-white">
                {t("insights.aiInsight")}
              </p>
            </div>

            <p className="text-sm text-ink-500 dark:text-gray-300 leading-relaxed">
              {entry.insight ||
                t("insights.defaultInsight")}
            </p>

            <p className="text-[11px] text-ink-300 dark:text-gray-500 mt-3">
              {t("insights.disclaimer")}
            </p>
          </GlassCard>

          {/* Additional insights */}
          {entry.insights?.length > 0 && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Brain
                  size={17}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="font-display font-semibold text-ink-900 dark:text-white">
                  {t("insights.title")}
                </p>
              </div>

              <div className="space-y-2">
                {entry.insights.map(
                  (insight, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm text-ink-500 dark:text-gray-300"
                    >
                      <span className="text-violet-500">
                        •
                      </span>

                      <span>{insight}</span>
                    </div>
                  )
                )}
              </div>
            </GlassCard>
          )}

          {/* Support level */}
          {entry.supportLevel && (
            <GlassCard>
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">
                  {entry.supportLevel ===
                  "urgent_support" ? (
                    <AlertTriangle
                      size={18}
                      className="text-orange-500"
                    />
                  ) : (
                    <ShieldCheck
                      size={18}
                      className="text-violet-600 dark:text-violet-400"
                    />
                  )}

                  <div>
                    <p className="font-display font-semibold text-ink-900 dark:text-white">
                      {t("insights.currentStatus")}
                    </p>

                    <p className="text-xs text-ink-400 dark:text-gray-500 mt-0.5">
                      {t("insights.disclaimer")}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                    entry.supportLevel ===
                    "urgent_support"
                      ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
                      : entry.supportLevel ===
                        "elevated"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                      : "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                  }`}
                >
                  {entry.supportLevel.replace(
                    "_",
                    " "
                  )}
                </span>

              </div>
            </GlassCard>
          )}

        </div>
      )}
    </div>
  );
}