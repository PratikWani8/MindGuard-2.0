import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  mood: { type: Number, required: true, min: 1, max: 10 },
  stressLevel: { type: Number, required: true, min: 1, max: 10 },
  energyLevel: { type: Number, required: true, min: 1, max: 10 },
  sleepHours: { type: Number, required: true, min: 0, max: 24 },
  sleepQuality: { type: Number, required: true, min: 1, max: 10 },
  focusLevel: { type: Number, required: true, min: 1, max: 10 },
  journalText: { type: String, trim: true, maxlength: 10000 }
}, { timestamps: true });

checkInSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("CheckIn", checkInSchema);