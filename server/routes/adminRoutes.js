import { Router } from "express";
import { authorize, protect } from "../middleware/auth.js";
import {
  listAuditLogs,
  listRiskEvents,
  listUsers,
  overview,
  updateRiskEventStatus,
  updateUserRole,
} from "../controllers/adminController.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/overview", overview);
router.get("/users", listUsers);
router.patch("/users/:userId/role", updateUserRole);
router.get("/risk-events", listRiskEvents);
router.patch("/risk-events/:eventId/status", updateRiskEventStatus);
router.get("/audit-logs", listAuditLogs);

export default router;
