import { Router } from "express";
import { list, get } from "../controllers/conversationController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/", list);
router.get("/:id", get);
export default router;