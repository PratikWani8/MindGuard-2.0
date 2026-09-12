import { Lock, Eye, UserCheck, ServerCog, Siren } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";

const sections = [
  {
    icon: Eye,
    title: "What we collect",
    body: "Mood, stress, sleep and focus check-ins, and journal entries you choose to write. Nothing is collected passively without your action.",
  },
  {
    icon: ServerCog,
    title: "How it's used",
    body: "Your entries are processed by sentiment, emotion and trend models to generate your personal insights and wellness plan — never sold or used for advertising.",
  },
  {
    icon: UserCheck,
    title: "Who can see it",
    body: "Only you, by default. Flagged elevated or urgent situations may be reviewed by a trained human moderator solely to arrange appropriate support.",
  },
  {
    icon: Lock,
    title: "Your control",
    body: "You can export, edit or delete your journal history and check-ins at any time from Settings.",
  },
];

export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <SectionHeading
        eyebrow="Privacy & Safety"
        title="Built to protect what you share"
        description="Mental wellbeing data is sensitive by nature. Here's exactly how MindGuard handles it, and what happens when the system detects something serious."
      />

      <div className="mt-14 grid sm:grid-cols-2 gap-5">
        {sections.map((s) => (
          <GlassCard key={s.title}>
            <div className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <s.icon size={20} strokeWidth={1.8} />
            </div>
            <h3 className="font-display font-semibold text-ink-900">{s.title}</h3>
            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{s.body}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard strong className="mt-8 border-2 border-red-100">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-red-50 text-calm-red flex items-center justify-center">
            <Siren size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink-900">In a crisis, we act fast - with people, not just AI</h3>
            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
              If MindGuard detects signals consistent with urgent risk, you're immediately shown emergency
              contact options and connected toward human support. MindGuard never replaces emergency
              services - if you or someone you know is in immediate danger, contact local emergency
              services right away.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
