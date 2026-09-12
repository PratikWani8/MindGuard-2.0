import api from "./api";

export const fetchWellbeingStatus = async () => {
  const response = await api.get("/api/insights/trends");

  const trends =
    response.data?.data?.trends ||
    response.data?.trends ||
    [];

  if (!trends.length) {
    return {
      summary: "No check-in data yet",
      level: "stable",
      score: 0,
    };
  }

  const latest = trends[trends.length - 1];

  const recent = trends.slice(-4);

  const avgStress =
    recent.reduce(
      (sum, item) => sum + Number(item.stressLevel || 0),
      0
    ) / recent.length;

  let level = "stable";
  let summary = "Your wellbeing looks steady";

  if (avgStress >= 7) {
    level = "elevated";
    summary = "Your recent check-ins show elevated stress";
  } else if (avgStress >= 4) {
    level = "watch";
    summary = "Your recent check-ins show some stress";
  }

  const avgMood =
    recent.reduce(
      (sum, item) => sum + Number(item.mood || 0),
      0
    ) / recent.length;

  const avgEnergy =
    recent.reduce(
      (sum, item) => sum + Number(item.energyLevel || 0),
      0
    ) / recent.length;

  const avgFocus =
    recent.reduce(
      (sum, item) => sum + Number(item.focusLevel || 0),
      0
    ) / recent.length;

  const score = Math.round(
    (avgMood / 10) * 30 +
    ((10 - avgStress) / 10) * 30 +
    (avgEnergy / 10) * 20 +
    (avgFocus / 10) * 20
  );

  return {
    summary,
    level,
    score,
    latest,
    trends,
  };
};

export const fetchDailyInsight = async () => {
  const response = await api.get("/api/insights/recent");

  const analyses =
    response.data?.data?.analyses ||
    response.data?.analyses ||
    [];

  if (!analyses.length) {
    return {
      title: "No AI insight yet",
      body: "Complete a check-in or journal entry to generate personalized insights.",
    };
  }

  const latest = analyses[0];

  return {
    title: "Your latest AI insight",
    body:
      latest.insight ||
      latest.insights?.[0] ||
      "Your latest wellbeing analysis is available.",
  };
};

export const fetchThemesAndEmotions = async () => {
  const [emotionResponse, recentResponse] = await Promise.all([
    api.get("/api/insights/emotions"),
    api.get("/api/insights/recent"),
  ]);

  const emotions =
    emotionResponse.data?.data?.emotions ||
    emotionResponse.data?.emotions ||
    [];

  const analyses =
    recentResponse.data?.data?.analyses ||
    recentResponse.data?.analyses ||
    [];

  const emotionTotals = {};

  emotions.forEach((analysis) => {
    (analysis.emotions || []).forEach((emotion) => {
      if (!emotion?.name) return;

      emotionTotals[emotion.name] =
        (emotionTotals[emotion.name] || 0) +
        Number(emotion.value || 0);
    });
  });

  const emotionData = Object.entries(emotionTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const themeCounts = {};

  analyses.forEach((analysis) => {
    (analysis.themes || []).forEach((theme) => {
      if (!theme) return;

      themeCounts[theme] =
        (themeCounts[theme] || 0) + 1;
    });
  });

  const themes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([theme]) => theme);

  const triggerTotals = {};

  analyses.forEach((analysis) => {
    (analysis.triggers || []).forEach((trigger) => {
      if (!trigger?.name) return;

      triggerTotals[trigger.name] =
        (triggerTotals[trigger.name] || 0) +
        Number(trigger.value || 0);
    });
  });

  const triggers = Object.entries(triggerTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return {
    emotions: emotionData,
    themes,
    triggers,
  };
};