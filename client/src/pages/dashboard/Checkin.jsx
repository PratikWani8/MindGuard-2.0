import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Frown,
  Meh,
  Smile,
  Laugh,
  Angry,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Moon,
  Zap,
  Focus,
  Flame,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { submitCheckin } from "../../services/checkinApi";
import { cn } from "../../utils/cn";

const moods = [
  {
    value: 1,
    label: "Very low",
    icon: Angry,
    color: "text-red-500 bg-red-50",
  },
  {
    value: 2,
    label: "Low",
    icon: Frown,
    color: "text-orange-500 bg-orange-50",
  },
  {
    value: 3,
    label: "Neutral",
    icon: Meh,
    color: "text-amber-500 bg-amber-50",
  },
  {
    value: 4,
    label: "Good",
    icon: Smile,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    value: 5,
    label: "Very good",
    icon: Laugh,
    color: "text-cyan-500 bg-cyan-50",
  },
];

function SliderField({
  icon: Icon,
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  hint,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
          <Icon size={17} />
        </div>

        <div>
          <p className="text-sm font-medium text-ink-800">{label}</p>

          {hint && (
            <p className="text-xs text-ink-400">
              {hint}
            </p>
          )}
        </div>

        <span className="ml-auto font-display font-semibold text-violet-600">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500 h-2 rounded-full"
      />
    </div>
  );
}

const steps = ["mood", "vitals", "journal", "done"];

export default function Checkin() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // IMPORTANT:
  // These names now exactly match the MongoDB CheckIn schema.
  const [data, setData] = useState({
    mood: 3,
    stressLevel: 5,
    energyLevel: 5,
    sleepHours: 6,
    sleepQuality: 5,
    focusLevel: 5,
    journalText: "",
  });

  const update = (patch) => {
    setData((current) => ({
      ...current,
      ...patch,
    }));
  };

  const next = async () => {
    // Save to MongoDB when user finishes journal
    if (steps[step] === "journal") {
      setSubmitting(true);
      setError("");

      try {
        // Payload exactly matching backend schema
        const payload = {
          mood: Number(data.mood),
          stressLevel: Number(data.stressLevel),
          energyLevel: Number(data.energyLevel),
          sleepHours: Number(data.sleepHours),
          sleepQuality: Number(data.sleepQuality),
          focusLevel: Number(data.focusLevel),
          journalText: data.journalText.trim(),
        };

        console.log("Submitting check-in:", payload);

        const result = await submitCheckin(payload);

        console.log("Check-in saved:", result);

        setStep((s) => Math.min(s + 1, steps.length - 1));
      } catch (err) {
        console.error(
          "CHECK-IN SUBMIT ERROR:",
          err.response?.data || err
        );

        setError(
          err.response?.data?.message ||
            "Failed to save your check-in. Please try again."
        );
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => {
    if (!submitting) {
      setStep((s) => Math.max(s - 1, 0));
    }
  };

  const progress = Math.round(
    ((step + 1) / steps.length) * 100
  );

  return (
    <div className="max-w-2xl mx-auto">

      {/* Progress */}
      {steps[step] !== "done" && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-ink-400 mb-1.5">
            <span>
              Step {step + 1} of {steps.length - 1}
            </span>

            <span>{progress}%</span>
          </div>

          <div className="h-1.5 rounded-full bg-violet-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-aqua-500"
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.4,
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 16,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -16,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          {/* ================= MOOD ================= */}
          {steps[step] === "mood" && (
            <GlassCard strong>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                How are you feeling right now?
              </h2>

              <p className="text-sm text-ink-400 mt-1">
                Pick the option that feels closest.
              </p>

              <div className="grid grid-cols-5 gap-2 mt-6">
                {moods.map((m) => {
                  const Icon = m.icon;

                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() =>
                        update({
                          mood: m.value,
                        })
                      }
                      className={cn(
                        "flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all focus-ring",
                        data.mood === m.value
                          ? "border-violet-400 bg-violet-50"
                          : "border-transparent bg-white/60 hover:bg-white"
                      )}
                    >
                      <span
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          m.color
                        )}
                      >
                        <Icon size={20} />
                      </span>

                      <span className="text-[11px] font-medium text-ink-600 text-center leading-tight">
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* ================= VITALS ================= */}
          {steps[step] === "vitals" && (
            <GlassCard strong className="space-y-7">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  A few more signals
                </h2>

                <p className="text-sm text-ink-400 mt-1">
                  This helps MindGuard spot patterns over time.
                </p>
              </div>

              <SliderField
                icon={Flame}
                label="Stress level"
                hint="1 = minimal, 10 = overwhelming"
                value={data.stressLevel}
                onChange={(value) =>
                  update({
                    stressLevel: value,
                  })
                }
              />

              <SliderField
                icon={Zap}
                label="Energy level"
                hint="1 = drained, 10 = energized"
                value={data.energyLevel}
                onChange={(value) =>
                  update({
                    energyLevel: value,
                  })
                }
              />

              <SliderField
                icon={Moon}
                label="Sleep last night (hours)"
                min={0}
                max={24}
                value={data.sleepHours}
                onChange={(value) =>
                  update({
                    sleepHours: value,
                  })
                }
              />

              <SliderField
                icon={Moon}
                label="Sleep quality"
                hint="1 = poor, 10 = excellent"
                value={data.sleepQuality}
                onChange={(value) =>
                  update({
                    sleepQuality: value,
                  })
                }
              />

              <SliderField
                icon={Focus}
                label="Focus today"
                hint="1 = scattered, 10 = sharp"
                value={data.focusLevel}
                onChange={(value) =>
                  update({
                    focusLevel: value,
                  })
                }
              />
            </GlassCard>
          )}

          {/* ================= JOURNAL ================= */}
          {steps[step] === "journal" && (
            <GlassCard strong>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Anything on your mind?{" "}
                <span className="text-ink-400 font-normal text-sm">
                  (optional)
                </span>
              </h2>

              <p className="text-sm text-ink-400 mt-1">
                MindGuard can gently analyze this for patterns and themes.
              </p>

              <textarea
                value={data.journalText}
                onChange={(e) =>
                  update({
                    journalText: e.target.value,
                  })
                }
                rows={7}
                maxLength={10000}
                placeholder="Write freely — there's no right way to do this…"
                className="w-full mt-4 rounded-2xl border border-violet-100 bg-white/70 p-4 text-sm leading-relaxed focus-ring focus:border-violet-300 resize-none"
              />

              <p className="text-xs text-ink-300 text-right mt-1">
                {data.journalText.length} characters
              </p>
            </GlassCard>
          )}

          {/* ================= DONE ================= */}
          {steps[step] === "done" && (
            <GlassCard strong className="text-center py-14">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} />
              </div>

              <h2 className="font-display text-2xl font-semibold text-ink-900">
                Check-in complete
              </h2>

              <p className="text-ink-400 mt-2 max-w-sm mx-auto">
                Thanks for showing up for yourself today. Your dashboard has
                been updated.
              </p>

              <Button
                className="mt-6"
                onClick={() => navigate("/dashboard")}
              >
                Go to dashboard
              </Button>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {steps[step] !== "done" && (
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0 || submitting}
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <Button
            onClick={next}
            disabled={submitting}
          >
            {submitting
              ? "Saving…"
              : steps[step] === "journal"
                ? "Finish check-in"
                : "Continue"}

            {!submitting && <ArrowRight size={16} />}
          </Button>
        </div>
      )}
    </div>
  );
}