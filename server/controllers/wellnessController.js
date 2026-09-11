import WellnessPlan from "../models/WellnessPlan.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const plans = await WellnessPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
  success(res, { plans }, "Wellness plans retrieved");
});

export const create = asyncHandler(async (req, res) => {
  const plan = await WellnessPlan.create({ ...req.body, userId: req.user._id });
  success(res, { plan }, "Wellness plan created", 201);
});

export const update = asyncHandler(async (req, res) => {
  const plan = await WellnessPlan.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body, { new: true, runValidators: true }
  );
  if (!plan) return failure(res, "Wellness plan not found", [], 404);
  success(res, { plan }, "Wellness plan updated");
});

export const progress = asyncHandler(async (req, res) => {
  const value = Number(req.body.progress);
  const plan = await WellnessPlan.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { progress: value }, { new: true, runValidators: true }
  );
  if (!plan) return failure(res, "Wellness plan not found", [], 404);
  success(res, { plan }, "Wellness progress updated");
});