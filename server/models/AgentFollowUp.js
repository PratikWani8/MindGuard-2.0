import mongoose from "mongoose";

const agentFollowUpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
    },

    relatedAction: {
      type: String,
      default: "",
    },

    scheduledFor: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending",
    },

    response: {
      type: String,
      default: "",
    },

    agentDecisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentDecision",
    },
  },
  {
    timestamps: true,
  }
);

agentFollowUpSchema.index({
  userId: 1,
  scheduledFor: 1,
});

export default mongoose.model(
  "AgentFollowUp",
  agentFollowUpSchema
);