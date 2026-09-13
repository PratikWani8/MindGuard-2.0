import { fetchTodayCheckin, fetchMoodTrend } from "./checkinApi";
import { fetchWellbeingStatus } from "./insightApi";
import { getLatestAgentDecision } from "./agentApi";

const MUSIC_LIBRARY = [
  {
    id: "calm-piano",
    title: "Calm Piano",
    artist: "MindGuard",
    category: "Stress Relief",
    mood: "calm",
    duration: "5 min",
    src: "/music/calm-piano.mp3",
    description: "Soft piano designed to create a slower, calmer atmosphere.",
  },
  {
    id: "deep-relaxation",
    title: "Deep Relaxation",
    artist: "MindGuard",
    category: "Deep Relaxation",
    mood: "relaxed",
    duration: "8 min",
    src: "/music/deep-relaxation.mp3",
    description: "Slow ambient sounds for unwinding after a stressful moment.",
  },
  {
    id: "focus-ambient",
    title: "Focus Ambient",
    artist: "MindGuard",
    category: "Focus",
    mood: "focused",
    duration: "10 min",
    src: "/music/focus-ambient.mp3",
    description: "Gentle ambient music for calm concentration.",
  },
  {
    id: "sleep-meditation",
    title: "Sleep Meditation",
    artist: "MindGuard",
    category: "Sleep",
    mood: "sleep",
    duration: "12 min",
    src: "/music/sleep-meditation.mp3",
    description: "Very slow ambient tones for preparing your mind for rest.",
  },
  {
    id: "uplifting-ambient",
    title: "Uplifting Ambient",
    artist: "MindGuard",
    category: "Gentle Energy",
    mood: "uplifting",
    duration: "6 min",
    src: "/music/uplifting-ambient.mp3",
    description: "Light atmospheric music for gently lifting your energy.",
  },
];

function numericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+(\.\d+)?/);

    if (match) {
      return Number(match[0]);
    }
  }

  return null;
}

function normalizeCheckin(checkin) {
  if (!checkin) return null;

  return {
    mood:
      checkin.mood ??
      checkin.moodLevel ??
      checkin.moodScore ??
      null,

    stressLevel:
      checkin.stressLevel ??
      checkin.stress ??
      null,

    energyLevel:
      checkin.energyLevel ??
      checkin.energy ??
      null,

    sleepHours:
      checkin.sleepHours ??
      checkin.sleep ??
      null,

    sleepQuality:
      checkin.sleepQuality ??
      null,

    focusLevel:
      checkin.focusLevel ??
      checkin.focus ??
      null,
  };
}

function determineMusicIntent(checkin, status, agent) {
  const data = normalizeCheckin(checkin);

  if (!data) {
    return {
      intent: "calm",
      reason:
        "A gentle calming track is a good starting point while MindGuard learns more about your current state.",
    };
  }

  const stress = numericValue(data.stressLevel);
  const energy = numericValue(data.energyLevel);
  const sleep = numericValue(data.sleepHours);
  const focus = numericValue(data.focusLevel);

  const riskLevel =
    agent?.riskLevel ||
    status?.riskLevel ||
    status?.risk ||
    "stable";

  if (
    riskLevel === "urgent_support" ||
    riskLevel === "elevated"
  ) {
    return {
      intent: "calm",
      reason:
        "Your recent wellness signals suggest that a gentle calming track may help you create a quieter moment.",
    };
  }

  if (stress !== null && stress >= 7) {
    return {
      intent: "deep-relaxation",
      reason:
        "Your recent check-in shows higher stress, so MindGuard selected slower ambient music to help you unwind.",
    };
  }

  if (sleep !== null && sleep < 6) {
    return {
      intent: "sleep",
      reason:
        "Your recent sleep signal suggests that a slower, softer soundscape may be useful for winding down.",
    };
  }

  
  if (energy !== null && energy <= 3) {
    return {
      intent: "uplifting",
      reason:
        "Your energy appears lower today, so MindGuard selected gentle uplifting ambient music.",
    };
  }

  if (
    focus !== null &&
    focus >= 7 &&
    (stress === null || stress <= 5)
  ) {
    return {
      intent: "focus",
      reason:
        "Your current signals look relatively steady, so MindGuard selected calm ambient music for focused time.",
    };
  }

  return {
    intent: "calm",
    reason:
      "Your recent wellness signals suggest that a calm, low-intensity track is a good fit right now.",
  };
}

function getTrackForIntent(intent) {
  const map = {
    "deep-relaxation": "deep-relaxation",
    sleep: "sleep-meditation",
    uplifting: "uplifting-ambient",
    focus: "focus-ambient",
    calm: "calm-piano",
  };

  const id = map[intent] || "calm-piano";

  return MUSIC_LIBRARY.find((track) => track.id === id) ||
    MUSIC_LIBRARY[0];
}

export async function getMusicRecommendation() {
  const results = await Promise.allSettled([
    fetchTodayCheckin(),
    fetchMoodTrend("7d"),
    fetchWellbeingStatus(),
    getLatestAgentDecision(),
  ]);

  const todayCheckin =
    results[0].status === "fulfilled"
      ? results[0].value
      : null;

  const trend =
    results[1].status === "fulfilled"
      ? results[1].value
      : [];

  const status =
    results[2].status === "fulfilled"
      ? results[2].value
      : null;

  const agent =
    results[3].status === "fulfilled"
      ? results[3].value
      : null;

  const { intent, reason } = determineMusicIntent(
    todayCheckin,
    status,
    agent
  );

  const recommendedTrack = getTrackForIntent(intent);

  const alternatives = MUSIC_LIBRARY.filter(
    (track) => track.id !== recommendedTrack.id
  );

  return {
    success: true,

    recommendation: {
      ...recommendedTrack,

      intent,

      reason,

      aiGenerated: true,

      aiMessage: `Based on your recent wellness signals, I recommend ${recommendedTrack.title.toLowerCase()} right now.`,

      checkinAvailable: Boolean(todayCheckin),

      riskLevel:
        agent?.riskLevel ||
        status?.riskLevel ||
        status?.risk ||
        "stable",

      trendAvailable:
        Array.isArray(trend)
          ? trend.length > 0
          : Boolean(trend),
    },

    alternatives,
  };
}

export function getMusicLibrary() {
  return MUSIC_LIBRARY;
}