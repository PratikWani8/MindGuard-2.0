import mongoose from "mongoose";

const agentDecisionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    observations: {
      type: [String],
      default: [],
    },

    analysis: {
      type: String,
      default: "",
    },

    reasoning: {
      type: String,
      default: "",
    },

    action: {
      type: String,
      enum: [
        "NO_ACTION",
        "WELLNESS_ACTIVITY",
        "JOURNAL_PROMPT",
        "WELLNESS_PLAN",
        "SUPPORT_RECOMMENDATION",
        "FOLLOW_UP",
      ],
      default: "NO_ACTION",
    },

    recommendation: {
      type: String,
      default: "",
    },

    riskLevel: {
      type: String,
      enum: [
        "stable",
        "needs_attention",
        "elevated",
        "urgent_support",
      ],
      default: "stable",
    },

    followUpRequired: {
      type: Boolean,
      default: false,
    },

    followUpQuestion: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      enum: ["checkin", "journal", "chat", "system"],
      default: "checkin",
    },
  },
  {
    timestamps: true,
  }
);

agentDecisionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("AgentDecision", agentDecisionSchema);