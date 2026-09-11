import { Router } from "express";
import { trends, emotions, recent } from "../controllers/insightsController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/trends", trends);
router.get("/emotions", emotions);
router.get("/recent", recent);
export default router;