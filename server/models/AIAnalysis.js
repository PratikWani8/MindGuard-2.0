import mongoose from "mongoose";

const emotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  { _id: false }
);

const triggerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  { _id: false }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    journalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journal",
      required: true,
      index: true
    },

    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral"
    },

    emotions: {
      type: [emotionSchema],
      default: []
    },

    themes: {
      type: [String],
      default: []
    },

    triggers: {
      type: [triggerSchema],
      default: []
    },

    insight: {
      type: String,
      default: ""
    },

    insights: {
      type: [String],
      default: []
    },

    supportLevel: {
      type: String,
      enum: [
        "stable",
        "elevated",
        "urgent_support"
      ],
      default: "stable"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "AIAnalysis",
  aiAnalysisSchema
);