import mongoose from "mongoose";

const supportResourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, required: true, index: true },
  organization: { type: String, default: "" },
  contact: { type: String, default: "" },
  website: { type: String, default: "" },
  location: { type: String, default: "" },
  isEmergency: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("SupportResource", supportResourceSchema);