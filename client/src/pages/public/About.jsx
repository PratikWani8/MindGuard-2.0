import {
  HeartPulse,
  Target,
  Users2,
  ShieldCheck,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import TiltedCard from "../../components/ui/TiltedCard";

import c1Photo from "../../assets/members/member1.png";
import c2Photo from "../../assets/members/member2.png";
import c3Photo from "../../assets/members/member3.png";
import c4Photo from "../../assets/members/member4.png";

const values = [
  {
    icon: HeartPulse,
    title: "Support, not diagnosis",
    body: "Every signal MindGuard shows is framed as wellbeing support - real clinical judgment stays with real professionals.",
  },
  {
    icon: Target,
    title: "Early, not reactive",
    body: "We look for gentle shifts across days and weeks, so small changes get noticed before they compound.",
  },
  {
    icon: ShieldCheck,
    title: "Safety by default",
    body: "Flagged situations are routed to human review, and emergency guidance is always one tap away.",
  },
  {
    icon: Users2,
    title: "Built with real routines",
    body: "Designed around the way students and young professionals actually check in - quick, honest, low-friction.",
  },
];

const creators = [
  {
    name: "Pratik Wani",
    role: "Team Lead",
    description:
      "Led the team, shaped MindGuard's vision, and coordinated AI, backend, frontend, and product development.",
    photo: c1Photo,
  },
  {
    name: "Omkar Gaikwad",
    role: "Frontend Developer",
    description:
      "Designed and developed the MindGuard experience with a focus on accessibility, simplicity, and a calm user interface.",
    photo: c2Photo,
  },
  {
    name: "Parth Chaukhunde",
    role: "Product & Research",
    description:
      "Focused on product thinking, user experience, research, and shaping MindGuard around real-world wellbeing needs.",
    photo: c3Photo,
  },
  {
    name: "Onkar Nemane",
    role: "AI/ML Engineer",
    description:
      "Worked on intelligent analysis, wellbeing patterns, and responsible AI features that support early intervention.",
    photo: c4Photo,
  },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">

      {/* About Heading */}
      <SectionHeading
        eyebrow="About MindGuard"
        title="A calmer way to notice how you're really doing"
        description="MindGuard was built for a simple reason: most people don't get a clear signal about their own wellbeing until it's already a crisis. We wanted an early, gentle, evidence-informed nudge instead."
      />

      {/* Values */}
      <div className="mt-14 grid sm:grid-cols-2 gap-5">
        {values.map((v) => (
          <GlassCard key={v.title}>
            <div className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <v.icon size={20} strokeWidth={1.8} />
            </div>

            <h3 className="font-display font-semibold text-ink-900">
              {v.title}
            </h3>

            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
              {v.body}
            </p>
          </GlassCard>
        ))}
      </div>

      <section className="mt-24">

        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto">
         <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-50/80 border border-violet-200 text-violet-600 text-sm font-medium mb-3 backdrop-blur-sm">
          Meet the team
        </p>

          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900">
            The people behind MindGuard
          </h2>

          <p className="text-ink-500 mt-3 leading-relaxed">
            MindGuard was brought to existence by a team passionate about
            technology, artificial intelligence, and building solutions that
            can make a meaningful difference.
          </p>
        </div>

        {/* Creator Cards */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6">

          {creators.map((creator) => (
            <TiltedCard
              key={creator.name}
              rotateAmplitude={10}
              scaleOnHover={1.035}
              className="h-full"
            >
              <div
                className="
                  h-full
                  rounded-3xl
                  border border-violet-100
                  bg-white/70
                  backdrop-blur-xl
                  p-6
                  shadow-sm
                  transition-shadow
                  duration-300
                  hover:shadow-xl
                  hover:shadow-violet-100/60
                "
              >

                {/* Photo */}
                <div className="flex justify-center">
  <div
    className="
      relative
      w-full
      h-56
      rounded-2xl
      overflow-hidden
      bg-gradient-to-br
      from-violet-100
      via-purple-50
      to-white
      border
      border-violet-100
    "
  >
    <img
      src={creator.photo}
      alt={creator.name}
      className="
        h-full
        w-full
        object-cover
        transition-transform
        duration-500
        hover:scale-105
      "
    />
  </div>
</div>

                {/* Creator information */}
                <div className="text-center mt-5">

                  <h3 className="font-display text-xl font-semibold text-ink-900">
                    {creator.name}
                  </h3>

                  <div
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      mt-2
                      rounded-full
                      bg-violet-100
                      text-violet-700
                      text-xs
                      font-medium
                    "
                  >
                    {creator.role}
                  </div>

                  <p className="text-sm text-ink-500 leading-relaxed mt-4">
                    {creator.description}
                  </p>

                </div>
              </div>
            </TiltedCard>
          ))}

        </div>
      </section>

      {/* Hackathon Section */}
      <GlassCard strong className="mt-14">
        <h3 className="font-display text-xl font-semibold text-ink-900">
          Built during hackathon, designed for real use
        </h3>

        <p className="text-ink-500 mt-2 leading-relaxed">
          MindGuard combines a mood and journal check-in flow, an AI analysis
          layer, and a support-escalation path all wrapped in a calm,
          distraction-free interface. It's a demonstration of what
          responsible, human-centered AI in mental wellness could look like:
          helpful, transparent about its limits, and quick to bring in real
          people when it matters.
        </p>
      </GlassCard>

    </div>
  );
}