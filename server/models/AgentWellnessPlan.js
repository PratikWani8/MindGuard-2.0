import mongoose from "mongoose";

const agentWellnessPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    goals: {
      type: [String],
      default: [],
    },

    activities: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    createdBy: {
      type: String,
      default: "ai-agent",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

agentWellnessPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("AgentWellnessPlan", agentWellnessPlanSchema);