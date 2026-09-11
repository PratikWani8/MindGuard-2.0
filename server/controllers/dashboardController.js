import CheckIn from "../models/CheckIn.js";
import AIAnalysis from "../models/AIAnalysis.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [latestCheckIn, recentCheckIns, recentAnalyses] = await Promise.all([
    CheckIn.findOne({ userId }).sort({ createdAt: -1 }),
    CheckIn.find({ userId }).sort({ createdAt: -1 }).limit(14)
      .select("mood stressLevel sleepHours energyLevel focusLevel createdAt"),
    AIAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(5)
      .select("sentiment emotions supportLevel insights recommendations trendScore modelVersion createdAt")
  ]);

  const avg = (items, field) => {
    if (!items.length) return null;
    return Number((items.reduce((s, x) => s + Number(x[field] || 0), 0) / items.length).toFixed(2));
  };

  success(res, {
    latestCheckIn,
    wellbeingSummary: {
      averageMood: avg(recentCheckIns, "mood"),
      averageStress: avg(recentCheckIns, "stressLevel"),
      averageSleep: avg(recentCheckIns, "sleepHours"),
      averageEnergy: avg(recentCheckIns, "energyLevel"),
      averageFocus: avg(recentCheckIns, "focusLevel")
    },
    moodTrend: recentCheckIns.map(x => ({ date: x.createdAt, value: x.mood })),
    stressTrend: recentCheckIns.map(x => ({ date: x.createdAt, value: x.stressLevel })),
    sleepTrend: recentCheckIns.map(x => ({ date: x.createdAt, value: x.sleepHours })),
    recentAIInsights: recentAnalyses
  }, "Dashboard retrieved");
});