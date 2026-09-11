import mongoose from "mongoose";

const riskEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  source: { type: String, required: true, enum: ["checkin", "journal", "chat", "ai_analysis", "manual"] },
  supportLevel: {
    type: String,
    required: true,
    enum: ["stable", "needs_attention", "elevated", "urgent_support"]
  },
  reason: { type: String, required: true, maxlength: 5000 },
  status: { type: String, enum: ["open", "reviewed", "resolved"], default: "open" }
}, { timestamps: true });

riskEventSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("RiskEvent", riskEventSchema);