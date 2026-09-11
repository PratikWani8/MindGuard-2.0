import {
  getRecentCheckins,
  getRecentAIAnalyses,
  getRecentRiskEvents,
  getPreviousAgentDecisions,
  calculateWellbeingScore,
  createWellnessPlan,
  createFollowUp,
} from "./aiAgentTools.js";

import AgentDecision from "../models/AgentDecision.js";
import { reasonWithAgent } from "./aiService.js";

const buildTrendSummary = (checkins) => {
  if (!checkins || checkins.length < 2) {
    return {
      moodTrend: "insufficient_data",
      stressTrend: "insufficient_data",
      sleepTrend: "insufficient_data",
      energyTrend: "insufficient_data",
    };
  }

  const latest = checkins[0];
  const oldest = checkins[checkins.length - 1];

  const trend = (latestValue, oldestValue) => {
    const difference = latestValue - oldestValue;

    if (difference >= 1) {
      return "increasing";
    }

    if (difference <= -1) {
      return "decreasing";
    }

    return "stable";
  };

  return {
    moodTrend: trend(
      latest.mood,
      oldest.mood
    ),

    stressTrend: trend(
      latest.stressLevel,
      oldest.stressLevel
    ),

    sleepTrend: trend(
      latest.sleepHours,
      oldest.sleepHours
    ),

    energyTrend: trend(
      latest.energyLevel,
      oldest.energyLevel
    ),
  };
};

const determineRiskLevel = (
  riskEvents = [],
  analyses = []
) => {
  const levels = [
    "urgent_support",
    "elevated",
    "needs_attention",
    "stable",
  ];

  const eventLevel =
    riskEvents[0]?.supportLevel;

  const analysisLevel =
    analyses[0]?.supportLevel;

  if (levels.includes(eventLevel)) {
    return eventLevel;
  }

  if (levels.includes(analysisLevel)) {
    return analysisLevel;
  }

  return "stable";
};

const applySafetyRules = ({
  riskLevel,
  latestCheckIn,
}) => {

  if (riskLevel === "urgent_support") {
    return {
      forcedAction: "SUPPORT_RECOMMENDATION",

      reason:
        "Existing risk assessment indicates urgent support may be appropriate.",
    };
  }

  if (
    latestCheckIn &&
    latestCheckIn.stressLevel >= 9 &&
    latestCheckIn.mood <= 3
  ) {
    return {
      forcedAction: "SUPPORT_RECOMMENDATION",

      reason:
        "Current check-in shows a high-stress and low-mood combination.",
    };
  }


  return null;
};

const ALLOWED_ACTIONS = [
  "NO_ACTION",
  "WELLNESS_ACTIVITY",
  "JOURNAL_PROMPT",
  "WELLNESS_PLAN",
  "SUPPORT_RECOMMENDATION",
  "FOLLOW_UP",
];

const normalizeDecision = (decision) => {

  if (
    !decision ||
    typeof decision !== "object"
  ) {
    return {
      observation:
        "The agent could not produce a structured decision.",

      reasoning: "",

      recommendation: "",

      action: "NO_ACTION",

      riskLevel: "stable",

      followUpRequired: false,

      followUpQuestion: "",
    };
  }

  const action =
    ALLOWED_ACTIONS.includes(
      decision.action
    )
      ? decision.action
      : "NO_ACTION";

  const validRiskLevels = [
    "stable",
    "needs_attention",
    "elevated",
    "urgent_support",
  ];

  const riskLevel =
    validRiskLevels.includes(
      decision.riskLevel
    )
      ? decision.riskLevel
      : "stable";


  return {
    observation:
      decision.observation || "",

    reasoning:
      decision.reasoning || "",

    recommendation:
      decision.recommendation || "",

    action,

    riskLevel,

    followUpRequired:
      decision.followUpRequired === true,

    followUpQuestion:
      decision.followUpQuestion || "",
  };
};

export const runMindGuardAgent = async (
  userId
) => {

  const [
    checkins,
    analyses,
    riskEvents,
    previousDecisions,
  ] = await Promise.all([

    getRecentCheckins(
      userId,
      7
    ),

    getRecentAIAnalyses(
      userId,
      7
    ),

    getRecentRiskEvents(
      userId,
      10
    ),

    getPreviousAgentDecisions(
      userId,
      5
    ),
  ]);

  if (!checkins.length) {
    return {
      success: false,

      message:
        "Not enough check-in data to run the MindGuard agent.",
    };
  }

  const latestCheckIn =
    checkins[0];

  const wellbeing =
    calculateWellbeingScore(
      checkins
    );

  const trends =
    buildTrendSummary(
      checkins
    );

  const riskLevel =
    determineRiskLevel(
      riskEvents,
      analyses
    );

  const latestAnalysis =
    analyses[0] || null;

  const safetyDecision =
    applySafetyRules({
      riskLevel,
      latestCheckIn,
    });

  const agentContext = {

    latestCheckIn: {

      mood:
        latestCheckIn.mood,

      stressLevel:
        latestCheckIn.stressLevel,

      energyLevel:
        latestCheckIn.energyLevel,

      sleepHours:
        latestCheckIn.sleepHours,

      sleepQuality:
        latestCheckIn.sleepQuality,

      focusLevel:
        latestCheckIn.focusLevel,

      hasJournal:
        Boolean(
          latestCheckIn.journalText
        ),
    },


    wellbeing,


    trends,


    riskLevel,


    latestAIAnalysis:
      latestAnalysis
        ? {

            sentiment:
              latestAnalysis.sentiment,

            emotions:
              latestAnalysis.emotions,

            themes:
              latestAnalysis.themes,

            triggers:
              latestAnalysis.triggers,

            supportLevel:
              latestAnalysis.supportLevel,

            insight:
              latestAnalysis.insight,
          }
        : null,


    previousAgentDecisions:
      previousDecisions.map(
        (previousDecision) => ({

          action:
            previousDecision.action,

          reasoning:
            previousDecision.reasoning,

          recommendation:
            previousDecision.recommendation,

          riskLevel:
            previousDecision.riskLevel,

          createdAt:
            previousDecision.createdAt,
        })
      ),
  };

  let decision;


  if (safetyDecision) {

    decision = {

      observation:
        safetyDecision.reason,

      reasoning:
        "A predefined safety rule has taken priority over general agent reasoning.",

      action:
        safetyDecision.forcedAction,

      recommendation:
        "Provide supportive guidance and encourage appropriate human support.",

      riskLevel,

      followUpRequired: true,

      followUpQuestion:
        "How are you feeling right now?",
    };

  }

  else {

    decision =
      await reasonWithAgent({

        userId,

        context:
          agentContext,
      });


    console.log(
      "AGENT DECISION:",
      decision
    );
  }

  decision =
    normalizeDecision(
      decision
    );

  if (
    riskLevel ===
    "urgent_support"
  ) {

    decision.action =
      "SUPPORT_RECOMMENDATION";

    decision.riskLevel =
      "urgent_support";

    decision.followUpRequired =
      true;

    if (
      !decision.followUpQuestion
    ) {
      decision.followUpQuestion =
        "How are you feeling right now?";
    }
  }

  const savedDecision =
    await AgentDecision.create({

      userId,


      observations: [

        decision.observation,

        `Wellbeing score: ${wellbeing.score}`,

        `Mood trend: ${trends.moodTrend}`,

        `Stress trend: ${trends.stressTrend}`,

        `Sleep trend: ${trends.sleepTrend}`,

        `Energy trend: ${trends.energyTrend}`,
      ],


      analysis:
        JSON.stringify({

          wellbeing,

          trends,

          riskLevel,
        }),


      reasoning:
        decision.reasoning,


      action:
        decision.action,


      recommendation:
        decision.recommendation,


      riskLevel:
        decision.riskLevel,


      followUpRequired:
        decision.followUpRequired,


      followUpQuestion:
        decision.followUpQuestion,


      source:
        "checkin",
    });

  let wellnessPlan =
    null;

  let followUp =
    null;

  if (
    decision.action ===
      "WELLNESS_PLAN" ||

    decision.action ===
      "WELLNESS_ACTIVITY"
  ) {

    wellnessPlan =
      await createWellnessPlan({

        userId,


        title:
          decision.action ===
          "WELLNESS_PLAN"

            ? "Personalized MindGuard Wellness Plan"

            : "Today's Wellness Activity",


        description:
          decision.recommendation,


        goals: [
          "Improve emotional wellbeing",
          "Reduce daily stress",
        ],


        activities: [

          {

            title:
              decision.recommendation ||
              "Complete a short wellbeing activity.",


            description:
              "Complete this activity at your own pace.",


            completed:
              false,
          },

        ],


        endDate:
          new Date(
            Date.now() +
              24 *
                60 *
                60 *
                1000
          ),
      });
  }

  if (
    decision.followUpRequired &&
    decision.followUpQuestion
  ) {

    followUp =
      await createFollowUp({

        userId,


        question:
          decision.followUpQuestion,


        relatedAction:
          decision.action,


        scheduledFor:
          new Date(
            Date.now() +
              24 *
                60 *
                60 *
                1000
          ),


        agentDecisionId:
          savedDecision._id,
      });
  }

  return {

    success: true,


    agent: {

      decisionId:
        savedDecision._id,


      observation:
        decision.observation,


      reasoning:
        decision.reasoning,


      action:
        decision.action,


      recommendation:
        decision.recommendation,


      riskLevel:
        decision.riskLevel,


      followUpRequired:
        decision.followUpRequired,


      followUpQuestion:
        decision.followUpQuestion,
    },


    wellbeing,


    trends,


    wellnessPlan,


    followUp,
  };
};