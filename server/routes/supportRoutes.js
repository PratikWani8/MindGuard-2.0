import { Router } from "express";
import { list } from "../controllers/supportController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.get("/resources", protect, list);
export default router;