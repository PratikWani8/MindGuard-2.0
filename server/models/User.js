import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  age: { type: Number, min: 13, max: 120 },
  role: { type: String, enum: ["user", "counselor", "admin"], default: "user" },
  profileImage: { type: String, default: "" },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "en" }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);