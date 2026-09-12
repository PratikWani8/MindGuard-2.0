import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { fetchJournals } from "../../services/journalApi";
import { cn } from "../../utils/cn";

const sentimentDot = {
  positive: "bg-calm-green",
  neutral: "bg-calm-amber",
  negative: "bg-calm-orange",
};

export default function JournalHistory() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const data = await fetchJournals();
        setJournals(data);
      } catch (error) {
        console.error("Failed to load journal history:", error);
        setJournals([]);
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      const text = `${j.title} ${j.content}`.toLowerCase();

      return !query || text.includes(query.toLowerCase());
    });
  }, [journals, query]);

  return (
    <div className="space-y-5">
      <GlassCard
        strong
        className="flex flex-col md:flex-row gap-3 md:items-center"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your journal entries…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300"
          />
        </div>
      </GlassCard>

      {loading ? (
        <LoadingSpinner label="Loading your journal" size="lg" />
      ) : filtered.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={BookOpen}
            title="No entries found"
            description="Write a new journal entry to get started."
          />
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((j) => (
            <Link key={j.id} to={`/dashboard/journal/${j.id}`}>
              <GlassCard className="h-full hover:bg-white/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      sentimentDot[j.sentiment] || "bg-calm-amber"
                    )}
                  />

                  <span className="text-[11px] text-ink-300">
                    {j.date}
                  </span>
                </div>

                <p className="font-semibold text-sm text-ink-800">
                  {j.title}
                </p>

                <p className="text-xs text-ink-400 mt-1 line-clamp-3">
                  {j.excerpt}
                </p>

                {j.themes?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {j.themes.slice(0, 2).map((theme) => (
                      <span
                        key={theme}
                        className="text-[10px] bg-violet-50 text-violet-600 px-2 py-1 rounded-full font-medium"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-violet-600 font-medium mt-3">
                  Open entry
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}