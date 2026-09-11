import { asyncHandler } from "../utils/asyncHandler.js";
import { success, failure } from "../utils/apiResponse.js";
import { runMindGuardAgent } from "../services/aiAgentService.js";
import AgentDecision from "../models/AgentDecision.js";
import AgentFollowUp from "../models/AgentFollowUp.js";
import AgentWellnessPlan from "../models/AgentWellnessPlan.js";

export const runAgent = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await runMindGuardAgent(userId);

  if (!result.success) {
    return failure(
      res,
      result.message || "Unable to run MindGuard agent",
      400
    );
  }

  return success(
    res,
    result,
    "MindGuard AI agent executed successfully"
  );
});


export const getLatestAgentDecision = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const decision = await AgentDecision.findOne({
      userId,
    }).sort({
      createdAt: -1,
    });

    if (!decision) {
      return failure(
        res,
        "No agent decision found",
        404
      );
    }

    return success(
      res,
      decision,
      "Latest agent decision fetched"
    );
  }
);

export const getAgentHistory = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const decisions = await AgentDecision.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return success(
      res,
      decisions,
      "Agent history fetched"
    );
  }
);

export const getAgentFollowUps = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const followUps = await AgentFollowUp.find({
      userId,
      status: "pending",
    })
      .sort({
        scheduledFor: 1,
      })
      .limit(20);

    return success(
      res,
      followUps,
      "Agent follow-ups fetched"
    );
  }
);

export const getWellnessPlan = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const plan = await AgentWellnessPlan.findOne({
      userId,
      status: "active",
    }).sort({
      createdAt: -1,
    });

    if (!plan) {
      return failure(
        res,
        "No active wellness plan found",
        404
      );
    }

    return success(
      res,
      plan,
      "Wellness plan fetched"
    );
  }
);