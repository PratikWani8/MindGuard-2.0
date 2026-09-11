import { Router } from "express";

import {
  createCheckIn,
  listCheckIns,
  getCheckIn,
  today,
  trends,
} from "../controllers/checkInController.js";

import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const numeric = (min, max) => ({
  required: true,
  numeric: true,
  min,
  max,
});

router.use(protect);

router.post(
  "/",
  validateBody({
    mood: numeric(1, 10),
    stressLevel: numeric(1, 10),
    energyLevel: numeric(1, 10),
    sleepHours: numeric(0, 24),
    sleepQuality: numeric(1, 10),
    focusLevel: numeric(1, 10),
  }),
  createCheckIn
);

router.get("/", listCheckIns);
router.get("/today", today);
router.get("/trends", trends);
router.get("/:id", getCheckIn);

export default router;