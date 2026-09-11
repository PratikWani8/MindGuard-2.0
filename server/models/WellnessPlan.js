import mongoose from "mongoose";

const wellnessPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  goals: { type: [String], default: [] },
  recommendations: { type: [String], default: [] },
  activities: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }],
  progress: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

export default mongoose.model("WellnessPlan", wellnessPlanSchema);