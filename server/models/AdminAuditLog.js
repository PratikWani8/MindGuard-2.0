import mongoose from "mongoose";

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["user_role_updated", "risk_event_status_updated"],
      required: true,
    },
    targetType: { type: String, enum: ["user", "risk_event"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

adminAuditLogSchema.index({ createdAt: -1 });

export default mongoose.model("AdminAuditLog", adminAuditLogSchema);
