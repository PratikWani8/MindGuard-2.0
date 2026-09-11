import { Router } from "express";
import { list } from "../controllers/riskController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.get("/", protect, list);
export default router;