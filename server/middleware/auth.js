import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { failure } from "../utils/apiResponse.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return failure(res, "Authentication required", [], 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return failure(res, "User not found", [], 401);

    req.user = user;
    next();
  } catch {
    return failure(res, "Invalid or expired token", [], 401);
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return failure(res, "Forbidden", [], 403);
  }
  next();
};