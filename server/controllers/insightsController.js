import CheckIn from "../models/CheckIn.js";
import AIAnalysis from "../models/AIAnalysis.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const trends = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const data = await CheckIn.find({ userId: req.user._id }).sort({ createdAt: 1 }).limit(limit)
    .select("mood stressLevel energyLevel sleepHours sleepQuality focusLevel createdAt");
  success(res, { trends: data }, "Wellbeing trends retrieved");
});

export const emotions = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const analyses = await AIAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(limit)
    .select("emotions sentiment createdAt");
  success(res, { emotions: analyses }, "Emotion insights retrieved");
});

export const recent = asyncHandler(async (req, res) => {
  const analyses = await AIAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
  success(res, { analyses }, "Recent AI insights retrieved");
});