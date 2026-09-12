// Central mock dataset — used only as a fallback when the backend
// endpoints aren't available yet. Every service function is written so
// swapping this out for a real API response requires no component changes.

export const mockUser = {
  id: "u_001",
  name: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  age: 21,
  avatarColor: "#7c5ce6",
  joinedAt: "2026-05-12",
};

export const moodTrend7d = [
  { day: "Mon", mood: 3.4, stress: 5.1, sleep: 5.2, focus: 3.1 },
  { day: "Tue", mood: 3.1, stress: 5.6, sleep: 4.8, focus: 2.9 },
  { day: "Wed", mood: 2.8, stress: 6.3, sleep: 4.4, focus: 2.6 },
  { day: "Thu", mood: 2.6, stress: 6.9, sleep: 4.1, focus: 2.4 },
  { day: "Fri", mood: 2.9, stress: 6.5, sleep: 4.6, focus: 2.7 },
  { day: "Sat", mood: 3.3, stress: 5.4, sleep: 5.8, focus: 3.2 },
  { day: "Sun", mood: 3.0, stress: 5.8, sleep: 5.0, focus: 3.0 },
];

export const moodTrend30d = Array.from({ length: 30 }).map((_, i) => {
  const base = 3.2 + Math.sin(i / 4) * 0.6 - (i > 20 ? (i - 20) * 0.04 : 0);
  return {
    day: `D${i + 1}`,
    mood: +(base + Math.random() * 0.3).toFixed(2),
    stress: +(6 - base + Math.random() * 0.4).toFixed(2),
    sleep: +(5 + Math.sin(i / 5) * 1.1).toFixed(2),
    focus: +(base - 0.3 + Math.random() * 0.3).toFixed(2),
  };
});

export const emotionDistribution = [
  { name: "Anxiety", value: 78, color: "#e8823d" },
  { name: "Stress", value: 84, color: "#e85d5d" },
  { name: "Sadness", value: 31, color: "#7c9ce6" },
  { name: "Frustration", value: 56, color: "#e8a53d" },
  { name: "Calm", value: 22, color: "#3fb886" },
];

export const detectedThemes = ["Academic pressure", "Sleep problems", "Fear of failure"];

export const wellbeingStatus = {
  level: "elevated", // stable | attention | elevated | urgent
  label: "Elevated concern",
  summary:
    "Your stress has been trending upward for 4 days alongside falling sleep. This is a wellbeing-support signal, not a diagnosis.",
};

export const wellbeingScore = 62; // out of 100

export const aiInsightOfDay = {
  title: "Stress is climbing across your last few check-ins",
  body:
    "Your stress level has increased over the last few check-ins, alongside a dip in sleep. Consider a short recovery break today and take a look at your wellness plan.",
};

export const recommendations = [
  {
    id: "r1",
    title: "4-7-8 Breathing",
    type: "breathing",
    duration: "3 min",
    description: "A short breathing pattern that helps calm a racing mind before study sessions.",
  },
  {
    id: "r2",
    title: "Body scan mindfulness",
    type: "mindfulness",
    duration: "5 min",
    description: "Bring attention gently through the body to release built-up tension.",
  },
  {
    id: "r3",
    title: "Wind-down sleep routine",
    type: "sleep",
    duration: "Tonight",
    description: "A simple pre-sleep sequence to help you fall asleep faster this week.",
  },
  {
    id: "r4",
    title: "Journaling prompt",
    type: "journal",
    duration: "5 min",
    description: "Write about one thing that felt heavy today, and one thing that felt light.",
  },
];

export const journals = [
  {
    id: "j_1",
    date: "2026-08-07",
    title: "Exam week is a lot",
    excerpt:
      "I've been sleeping very little because of exams. I can't concentrate and I'm constantly worried that I'll fail.",
    content:
      "I've been sleeping very little because of exams. I can't concentrate and I'm constantly worried that I'll fail. Every time I sit down to study my mind drifts to worst-case scenarios and I lose another hour just spiraling.",
    analyzed: true,
    sentiment: "negative",
    emotions: [
      { name: "Anxiety", value: 78 },
      { name: "Stress", value: 84 },
      { name: "Sadness", value: 31 },
      { name: "Frustration", value: 56 },
    ],
    themes: ["Academic pressure", "Sleep problems", "Fear of failure"],
    insight:
      "This entry shows strong anxiety tied to academic performance and disrupted sleep. Short breathing breaks before study sessions may help regulate the spiral before it builds.",
  },
  {
    id: "j_2",
    date: "2026-08-05",
    title: "A calmer day",
    excerpt: "Went for a walk after classes and actually felt okay for a while.",
    content:
      "Went for a walk after classes and actually felt okay for a while. Still thinking about the upcoming exams but it felt more manageable today.",
    analyzed: true,
    sentiment: "neutral",
    emotions: [
      { name: "Calm", value: 48 },
      { name: "Stress", value: 40 },
      { name: "Hope", value: 33 },
    ],
    themes: ["Academic pressure", "Physical activity"],
    insight: "A short walk seems to have meaningfully lowered stress today — worth repeating.",
  },
  {
    id: "j_3",
    date: "2026-08-02",
    title: "Rough night",
    excerpt: "Couldn't sleep again, kept thinking about everything I still need to finish.",
    content:
      "Couldn't sleep again, kept thinking about everything I still need to finish. Woke up tired and irritated for most of the day.",
    analyzed: true,
    sentiment: "negative",
    emotions: [
      { name: "Stress", value: 71 },
      { name: "Frustration", value: 62 },
      { name: "Fatigue", value: 58 },
    ],
    themes: ["Sleep problems", "Workload"],
    insight: "Sleep disruption and workload stress appear closely linked in your recent entries.",
  },
];

export const chatSuggestedPrompts = [
  "Help me understand my recent stress pattern.",
  "Give me a short breathing exercise.",
  "Help me create a healthier study routine.",
];

export const supportResources = [
  {
    category: "Mental health education",
    items: [
      { title: "Understanding anxiety vs everyday stress", type: "Article", link: "#" },
      { title: "How sleep affects mood regulation", type: "Article", link: "#" },
      { title: "Recognising burnout early", type: "Guide", link: "#" },
    ],
  },
  {
    category: "Professional support",
    items: [
      { title: "Campus counseling center", type: "Book a session", link: "#" },
      { title: "Licensed therapist directory", type: "Directory", link: "#" },
    ],
  },
  {
    category: "Emergency support",
    items: [
      { title: "National mental health helpline", type: "Call now", link: "#" },
      { title: "Crisis text support", type: "Text now", link: "#" },
    ],
  },
  {
    category: "Campus & community",
    items: [
      { title: "Peer support circles", type: "Weekly", link: "#" },
      { title: "Student wellness workshops", type: "Monthly", link: "#" },
    ],
  },
];

export const wellnessPlanToday = {
  completion: 2,
  total: 4,
  items: [
    { id: "w1", title: "Morning breathing (4-7-8)", type: "breathing", done: true },
    { id: "w2", title: "5-minute mindfulness break", type: "mindfulness", done: true },
    { id: "w3", title: "Wind-down routine before bed", type: "sleep", done: false },
    { id: "w4", title: "Evening journaling prompt", type: "journal", done: false },
  ],
};

export const interventionHistory = [
  { date: "2026-08-05", type: "Elevated concern flagged", action: "Recommended breathing + counseling resources" },
  { date: "2026-07-29", type: "Sleep anomaly detected", action: "Suggested wind-down routine" },
  { date: "2026-07-20", type: "Needs attention flagged", action: "Sent journaling prompt + trend summary" },
];

export const commonTriggers = [
  { name: "Exams", count: 9 },
  { name: "Sleep loss", count: 7 },
  { name: "Workload", count: 6 },
  { name: "Social conflict", count: 3 },
  { name: "Finances", count: 2 },
];
