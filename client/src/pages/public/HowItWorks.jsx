import { PenSquare, BrainCircuit, TrendingUp, Gauge, Leaf, LifeBuoy } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import RiskBadge from "../../components/cards/RiskBadge";

const flow = [
  { icon: PenSquare, title: "Daily check-in", body: "Rate your mood, stress, energy, sleep and focus in under a minute, with an optional journal entry." },
  { icon: BrainCircuit, title: "AI journal analysis", body: "Sentiment and emotion models read your entry for stress topics and recurring themes - never for a diagnosis." },
  { icon: TrendingUp, title: "Trend engine", body: "MindGuard compares today against your 7 and 30-day history to catch sudden changes or slow drifts." },
  { icon: Gauge, title: "Risk-level signal", body: "A clear status - Stable, Needs attention, Elevated concern, or Urgent support recommended." },
  { icon: Leaf, title: "Personalized plan", body: "Breathing exercises, mindfulness activities, sleep suggestions and journaling prompts, tailored to your patterns." },
  { icon: LifeBuoy, title: "Human support when needed", body: "Elevated or urgent signals surface real counselor and emergency resources, with human review of flagged cases." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <SectionHeading
        eyebrow="How it works"
        title="From a two-minute check-in to a clear next step"
        description="Every part of MindGuard is designed to be transparent about what it knows and doesn't know and to bring in real people the moment that's the right call."
      />

      <div className="mt-14 relative">
        <div className="hidden md:block absolute left-[27px] top-4 bottom-4 w-px bg-violet-200" />
        <div className="space-y-5">
          {flow.map((f, i) => (
            <div key={f.title} className="flex gap-5 items-start">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center shadow-soft z-10">
                <f.icon size={22} strokeWidth={1.8} />
              </div>
              <GlassCard className="flex-1">
                <p className="text-xs font-semibold text-violet-500 mb-1">Step {i + 1}</p>
                <h3 className="font-display font-semibold text-ink-900">{f.title}</h3>
                <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{f.body}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      <GlassCard strong className="mt-14">
        <h3 className="font-display text-xl font-semibold text-ink-900 mb-4">Understanding your status</h3>
        <div className="flex flex-wrap gap-3">
          <RiskBadge level="stable" size="lg" />
          <RiskBadge level="attention" size="lg" />
          <RiskBadge level="elevated" size="lg" />
          <RiskBadge level="urgent" size="lg" />
        </div>
        <p className="text-sm text-ink-500 mt-4 leading-relaxed">
          These labels describe a wellbeing-support signal based on your recent check-ins and journal
          entries they are not a medical or psychiatric diagnosis. If you're ever in crisis, please
          contact local emergency services or a crisis helpline right away.
        </p>
      </GlassCard>
    </div>
  );
}
