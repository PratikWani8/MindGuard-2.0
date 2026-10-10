import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, History, Mic } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { createJournal, fetchJournals } from "../../services/journalApi";

export default function Journal() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const journals = await fetchJournals();
        setRecent(journals.slice(0, 3));
      } catch (error) {
        console.error("Failed to load journals:", error);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t("journal.voiceError"));
      return;
    }

    // Stop listening
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    // Start listening
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      i18n.language === "hi"
        ? "hi-IN"
        : i18n.language === "mr"
        ? "mr-IN"
        : "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        setContent((prev) => {
          const separator = prev.trim() ? " " : "";
          return prev + separator + finalTranscript.trim();
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const onSave = async () => {
    if (!content.trim()) return;

    setSaving(true);

    try {
      const entry = await createJournal({
        title: title.trim() || t("journal.newEntry"),
        content: content.trim(),
      });

      navigate(`/dashboard/journal/${entry.id}`, {
        state: {
          draft: entry,
        },
      });
    } catch (error) {
      console.error("Failed to create journal:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GlassCard strong>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
              {t("journal.newEntry")}
            </h2>

            <Link
              to="/dashboard/journal/history"
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <History size={13} />
              {t("journal.viewHistory")}
            </Link>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("journal.titlePlaceholder")}
            className="w-full rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500 mb-3"
          />

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder={t("journal.contentPlaceholder")}
              className="w-full rounded-2xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] p-4 pb-16 text-sm leading-relaxed text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500 resize-none"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={listening ? t("journal.voiceStop") : t("journal.voiceStart")}
              title={listening ? t("journal.voiceStop") : t("journal.voiceInput")}
              className={`absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${
                listening
                  ? "bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse"
                  : "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/60 hover:scale-105"
              }`}
            >
              <Mic size={19} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-ink-300 dark:text-gray-500">
              {content.length} {t("common.characters")}
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onSave}
                disabled={saving || !content.trim()}
              >
                {t("journal.saveOnly")}
              </Button>

              <Button
                size="sm"
                onClick={onSave}
                disabled={saving || !content.trim()}
              >
                <Sparkles size={15} />
                {saving ? t("journal.saving") : t("journal.saveAndAnalyze")}
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <p className="font-display font-semibold text-ink-900 dark:text-white px-1">
          {t("journal.recentEntries")}
        </p>

        {loading ? (
          <LoadingSpinner label={t("journal.loadingEntries")} />
        ) : recent.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-ink-400 dark:text-gray-400">
              {t("journal.noEntriesYet")}
            </p>
          </GlassCard>
        ) : (
          recent.map((j) => (
            <Link key={j.id} to={`/dashboard/journal/${j.id}`}>
              <GlassCard className="hover:bg-white/80 dark:hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-ink-800 dark:text-gray-100">
                    {j.title}
                  </p>

                  <span className="text-[11px] text-ink-300 dark:text-gray-500">
                    {j.date}
                  </span>
                </div>

                <p className="text-xs text-ink-400 dark:text-gray-400 line-clamp-2">
                  {j.excerpt}
                </p>

                <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium mt-2">
                  {t("common.viewEntry")}
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}