import SupportResource from "../models/SupportResource.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  const resources = await SupportResource.find(filter).sort({ isEmergency: -1, title: 1 });
  success(res, { resources }, "Support resources retrieved");
});