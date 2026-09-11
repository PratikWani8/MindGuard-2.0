import CheckIn from "../models/CheckIn.js";
import AIAnalysis from "../models/AIAnalysis.js";
import RiskEvent from "../models/RiskEvent.js";
import AgentDecision from "../models/AgentDecision.js";
import AgentWellnessPlan from "../models/AgentWellnessPlan.js";
import AgentFollowUp from "../models/AgentFollowUp.js";

export const getRecentCheckins = async (userId, limit = 7) => {
  return CheckIn.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getRecentAIAnalyses = async (userId, limit = 7) => {
  return AIAnalysis.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getRecentRiskEvents = async (userId, limit = 10) => {
  return RiskEvent.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getPreviousAgentDecisions = async (
  userId,
  limit = 5
) => {
  return AgentDecision.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const calculateWellbeingScore = (checkins = []) => {
  if (!checkins.length) {
    return {
      score: null,
      explanation: "Not enough check-in data.",
    };
  }

  const latest = checkins[0];

  const mood = latest.mood;
  const stress = 11 - latest.stressLevel;
  const energy = latest.energyLevel;
  const sleepQuality = latest.sleepQuality;
  const focus = latest.focusLevel;

  const score =
    mood * 10 * 0.25 +
    stress * 10 * 0.20 +
    energy * 10 * 0.20 +
    sleepQuality * 10 * 0.20 +
    focus * 10 * 0.15;

  return {
    score: Math.round(score),
    explanation:
      "Calculated from mood, stress, energy, sleep quality and focus.",
  };
};

export const createWellnessPlan = async ({
  userId,
  title,
  description,
  goals,
  activities,
  endDate,
}) => {
  return AgentWellnessPlan.create({
    userId,
    title,
    description,
    goals,
    activities,
    endDate,
    createdBy: "ai-agent",
  });
};

export const createFollowUp = async ({
  userId,
  question,
  relatedAction,
  scheduledFor,
  agentDecisionId,
}) => {
  return AgentFollowUp.create({
    userId,
    question,
    relatedAction,
    scheduledFor,
    agentDecisionId,
  });
};