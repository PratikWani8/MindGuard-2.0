import { Router } from "express";
import {
  createJournal,
  listJournals,
  getJournal,
  analyzeJournalEntry,
  updateJournal,
  deleteJournal
} from "../controllers/journalController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  validateBody({
    title: {
      required: false,
      type: "string",
      maxLength: 200
    },
    content: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 20000
    }
  }),
  createJournal
);

router.get("/", listJournals);

router.get("/:id", getJournal);

router.post("/:id/analyze", analyzeJournalEntry);

router.put(
  "/:id",
  validateBody({
    title: {
      required: false,
      type: "string",
      maxLength: 200
    },
    content: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 20000
    }
  }),
  updateJournal
);

router.delete("/:id", deleteJournal);

export default router;