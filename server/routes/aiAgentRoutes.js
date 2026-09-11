import express from "express";

import {
  runAgent,
  getLatestAgentDecision,
  getAgentHistory,
  getAgentFollowUps,
  getWellnessPlan,
} from "../controllers/aiAgentController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Run AI Agent
router.post(
  "/run",
  protect,
  runAgent
);

// Latest decision
router.get(
  "/latest",
  protect,
  getLatestAgentDecision
);

// Agent history
router.get(
  "/history",
  protect,
  getAgentHistory
);

// Pending follow-ups
router.get(
  "/followups",
  protect,
  getAgentFollowUps
);

// Active wellness plan
router.get(
  "/wellness-plan",
  protect,
  getWellnessPlan
);

export default router;