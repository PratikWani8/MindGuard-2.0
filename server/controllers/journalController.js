import Journal from "../models/Journal.js";
import AIAnalysis from "../models/AIAnalysis.js";
import RiskEvent from "../models/RiskEvent.js";
import { analyzeJournal } from "../services/aiService.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.create({
    userId: req.user._id,
    title: req.body.title?.trim() || "Untitled entry",
    content: req.body.content
  });

  try {
    const result = await analyzeJournal({
      userId: req.user._id.toString(),
      text: journal.content
    });

    const analysis = await AIAnalysis.create({
      ...result,
      userId: req.user._id,
      journalId: journal._id
    });

    if (
      analysis.supportLevel === "elevated" ||
      analysis.supportLevel === "urgent_support"
    ) {
      await RiskEvent.create({
        userId: req.user._id,
        source: "journal",
        supportLevel: analysis.supportLevel,
        reason:
          (analysis.insights || []).join("; ") ||
          "AI identified a need for additional support"
      });
    }
  } catch (error) {
    console.error("AI journal analysis failed:", error.message);
  }

  success(res, { journal }, "Journal entry created", 201);
});

export const listJournals = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);

  const journals = await Journal.find({
    userId: req.user._id
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  success(res, { journals }, "Journal entries retrieved");
});

export const getJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!journal) {
    return failure(res, "Journal entry not found", [], 404);
  }

  const analysis = await AIAnalysis.findOne({
    journalId: journal._id,
    userId: req.user._id
  }).sort({ createdAt: -1 });

  success(
    res,
    {
      journal,
      analysis
    },
    "Journal entry retrieved"
  );
});

export const analyzeJournalEntry = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!journal) {
    return failure(res, "Journal entry not found", [], 404);
  }

  try {
    const result = await analyzeJournal({
      userId: req.user._id.toString(),
      text: journal.content
    });

    const analysis = await AIAnalysis.findOneAndUpdate(
      {
        journalId: journal._id,
        userId: req.user._id
      },
      {
        ...result,
        userId: req.user._id,
        journalId: journal._id
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    if (
      analysis.supportLevel === "elevated" ||
      analysis.supportLevel === "urgent_support"
    ) {
      await RiskEvent.create({
        userId: req.user._id,
        source: "journal",
        supportLevel: analysis.supportLevel,
        reason:
          (analysis.insights || []).join("; ") ||
          "AI identified a need for additional support"
      });
    }

    success(
      res,
      {
        journal,
        analysis
      },
      "Journal analyzed successfully"
    );
  } catch (error) {
    console.error("AI journal analysis failed:", error.message);

    failure(
      res,
      "Failed to analyze journal entry",
      [error.message],
      500
    );
  }
});

export const updateJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id
    },
    {
      title: req.body.title?.trim() || "Untitled entry",
      content: req.body.content
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!journal) {
    return failure(res, "Journal entry not found", [], 404);
  }

  success(res, { journal }, "Journal entry updated");
});

export const deleteJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!journal) {
    return failure(res, "Journal entry not found", [], 404);
  }

  await AIAnalysis.deleteMany({
    journalId: journal._id,
    userId: req.user._id
  });

  success(res, {}, "Journal entry deleted");
});