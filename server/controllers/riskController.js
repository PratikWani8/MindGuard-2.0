import RiskEvent from "../models/RiskEvent.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const events = await RiskEvent.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  success(res, { events }, "Safety events retrieved");
});