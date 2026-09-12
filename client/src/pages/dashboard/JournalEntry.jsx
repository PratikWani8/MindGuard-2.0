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
        label="Loading entry"
        size="lg"
      />
    );
  }

  if (!entry) {
    return (
      <GlassCard>
        Entry not found.
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
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-violet-600"
      >
        <ArrowLeft size={16} />
        Back to journal history
      </Link>

      {/* Journal */}
      <GlassCard strong>
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-300">
            {entry.date}
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink-900 mt-1">
          {entry.title}
        </h1>

        <p className="text-ink-600 leading-relaxed mt-4 whitespace-pre-line">
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

          <p className="text-ink-500 text-sm mb-4">
            This entry hasn't been analyzed yet.
          </p>

          <Button onClick={runAnalysis}>
            <Sparkles size={16} />
            Analyze with AI
          </Button>
        </GlassCard>
      )}

      {/* Loading */}
      {analyzing && (
        <LoadingSpinner
          label="Analyzing your entry with AI"
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
                  className="text-violet-600"
                />

                <p className="font-display font-semibold text-ink-900">
                  Emotion breakdown
                </p>
              </div>

              {emotionData.length > 0 ? (
                <EmotionDonut data={emotionData} />
              ) : (
                <p className="text-sm text-ink-400">
                  No emotion data available.
                </p>
              )}
            </GlassCard>

            {/* Themes */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Tag
                  size={17}
                  className="text-violet-600"
                />

                <p className="font-display font-semibold text-ink-900">
                  Detected themes
                </p>
              </div>

              {entry.themes?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {entry.themes.map((theme) => (
                    <span
                      key={theme}
                      className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">
                  No themes detected.
                </p>
              )}
            </GlassCard>

          </div>

          {/* Sentiment */}
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400">
                  Overall sentiment
                </p>

                <p className="font-display text-xl font-semibold text-ink-900 capitalize mt-1">
                  {entry.sentiment}
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  entry.sentiment === "positive"
                    ? "bg-green-50 text-green-700"
                    : entry.sentiment === "negative"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-50 text-gray-600"
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
                className="text-violet-600"
              />

              <p className="font-display font-semibold text-ink-900">
                AI insight
              </p>
            </div>

            <p className="text-sm text-ink-500 leading-relaxed">
              {entry.insight ||
                "No insight available."}
            </p>

            <p className="text-[11px] text-ink-300 mt-3">
              This is a wellbeing-support observation,
              not a diagnosis.
            </p>
          </GlassCard>

          {/* Additional insights */}
          {entry.insights?.length > 0 && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Brain
                  size={17}
                  className="text-violet-600"
                />

                <p className="font-display font-semibold text-ink-900">
                  AI observations
                </p>
              </div>

              <div className="space-y-2">
                {entry.insights.map(
                  (insight, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm text-ink-500"
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
                      className="text-violet-600"
                    />
                  )}

                  <div>
                    <p className="font-display font-semibold text-ink-900">
                      Support level
                    </p>

                    <p className="text-xs text-ink-400 mt-0.5">
                      AI-generated wellbeing signal
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                    entry.supportLevel ===
                    "urgent_support"
                      ? "bg-orange-50 text-orange-700"
                      : entry.supportLevel ===
                        "elevated"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-green-50 text-green-700"
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