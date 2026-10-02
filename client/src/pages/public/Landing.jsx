import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookHeart, TrendingUp, ShieldCheck,
  MessagesSquare, Users, Lock, Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ShinyText from "../../components/ui/ShinyText"; 
import Button from "../../components/common/Button";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import RiskBadge from "../../components/cards/RiskBadge";
import MoodTrendChart from "../../components/charts/MoodTrendChart";
import EmotionDonut from "../../components/charts/EmotionDonut";
import { moodTrend7d, emotionDistribution, detectedThemes } from "../../data/mockData";

export default function Landing() {
  const { t } = useTranslation();

  const capabilities = [
    { icon: BookHeart, title: "Journal analysis", body: "Sentiment and emotion detection surface what's really going on beneath a busy week." },
    { icon: TrendingUp, title: "Trend engine", body: "7 and 30-day trends catch stress, sleep and mood shifts before they compound." },
    { icon: ShieldCheck, title: "Risk-level signal", body: "A clear, non-clinical status — Stable to Urgent — so you know when to pause." },
    { icon: MessagesSquare, title: "Grounded AI assistant", body: "Retrieval-based answers with real references, never posing as a therapist." },
  ];

  const steps = [
    { title: t("landing.step1Title"), body: t("landing.step1Desc") },
    { title: t("landing.step2Title"), body: t("landing.step2Desc") },
    { title: t("landing.step3Title"), body: t("landing.step3Desc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-14 md:pt-20 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 rounded-full mb-5">
              <Sparkles size={13} /> 
              <ShinyText
                text={t("landing.aiSupportBadge")}
                className="text-sm font-semibold"
                speed={4}
                delay={0}
                color="#8b5cf6"
                shineColor="#ffffff"
                spread={120}
                pauseOnHover={false}
              />
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink-900 dark:text-white leading-[1.1]">
              {t("landing.heroTitle1")}
              <br />
              {t("landing.heroTitle2")}
              <br />
              <span className="bg-gradient-to-br from-violet-600 to-aqua-500 bg-clip-text text-transparent">
                {t("landing.heroTitle3")}
              </span>
            </h1>
            <p className="mt-5 text-ink-500 dark:text-gray-300 text-lg max-w-lg">
              {t("landing.heroDesc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-aqua-500 text-white font-medium hover:opacity-95 transition"
              >
                {t("landing.startCheckin")} <ArrowRight size={18} />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-200 dark:border-white/10 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-white/[0.05] transition"
              >
                {t("landing.seeHowItWorks")}
              </Link>
            </div>
            <p className="mt-5 text-xs text-ink-400 dark:text-gray-500 max-w-md">
              {t("landing.medicalDisclaimer")}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <GlassCard strong className="relative">
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-violet-300/40 blur-2xl animate-breathe" />
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-ink-700 dark:text-gray-200">{t("landing.todaysWellbeing")}</p>
                <RiskBadge level="elevated" />
              </div>
              <MoodTrendChart data={moodTrend7d} dataKey="stress" color="#e8823d" label={t("trends.stress")} />
              <div className="mt-4 grid grid-cols-3 gap-2">
                {detectedThemes.map((theme) => (
                  <span key={theme} className="text-[11px] text-center bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-lg px-2 py-1.5 font-medium">
                    {theme}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              eyebrow={t("landing.problemEyebrow")}
              title={t("landing.problemTitle")}
              description={t("landing.problemDesc")}
            />
          </div>
          <GlassCard>
            <p className="text-sm font-semibold text-ink-700 dark:text-gray-200 mb-3">A real check-in, analyzed instantly</p>
            <blockquote className="text-ink-600 dark:text-gray-300 italic leading-relaxed border-l-2 border-violet-300 pl-4">
              "I've been sleeping very little because of exams. I can't concentrate and I'm constantly
              worried that I'll fail."
            </blockquote>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-ink-400 dark:text-gray-400">{t("journal.detectedThemes")}</span>
              <span className="text-ink-700 dark:text-gray-200 font-medium">Academic pressure · Sleep · Fear of failure</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <SectionHeading eyebrow={t("landing.howItWorksEyebrow")} title={t("landing.howItWorksTitle")} align="center" />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <GlassCard key={s.title} className="relative">
              <span className="font-display text-3xl font-semibold text-violet-200 dark:text-violet-900">0{i + 1}</span>
              <h3 className="font-display font-semibold text-ink-900 dark:text-white mt-3">{s.title}</h3>
              <p className="text-sm text-ink-500 dark:text-gray-300 mt-2 leading-relaxed">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* AI capabilities */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <SectionHeading eyebrow={t("landing.underHoodEyebrow")} title={t("landing.underHoodTitle")} align="center" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((c) => (
            <GlassCard key={c.title} className="text-left">
              <div className="h-11 w-11 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-4">
                <c.icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-semibold text-ink-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-ink-500 dark:text-gray-400 mt-1.5 leading-relaxed">{c.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <GlassCard strong>
            <p className="text-sm font-semibold text-ink-700 dark:text-gray-200 mb-3">{t("journal.emotionBreakdown")}</p>
            <EmotionDonut data={emotionDistribution} />
          </GlassCard>
          <GlassCard strong className="flex flex-col justify-center">
            <SectionHeading
              eyebrow={t("common.dashboard")}
              title="Every trend, in one calm view"
              description="Wellbeing score, mood and stress trends, sleep correlation and your personalized plan — all in a single dashboard designed to feel calm, not clinical."
            />
            <Button as={Link} to="/register" className="mt-6 w-fit">
              {t("landing.previewDashboard")} <ArrowRight size={18} />
            </Button>
          </GlassCard>
        </div>
      </section>

      {/* Privacy and safety */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <GlassCard strong className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={18} className="text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">{t("landing.privacyEyebrow")}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">{t("landing.privacyTitle")}</h3>
            <p className="text-ink-500 dark:text-gray-300 mt-2 leading-relaxed max-w-xl">
              {t("landing.privacyDesc")}
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <Button as={Link} to="/privacy" variant="secondary">
              {t("landing.readPrivacy")}
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="rounded-4xl bg-gradient-to-br from-violet-600 to-aqua-500 p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <Users size={28} className="mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-semibold">{t("landing.ctaTitle")}</h2>
          <p className="mt-3 text-white/85 max-w-md mx-auto">
            {t("landing.ctaDesc")}
          </p>
          <Button as={Link} to="/register" variant="secondary" size="lg" className="mt-7 bg-white text-violet-700 hover:bg-white/90">
            {t("landing.ctaBtn")}
          </Button>
        </div>
      </section>
    </div>
  );
}
