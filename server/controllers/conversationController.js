import Conversation from "../models/Conversation.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ userId: req.user._id })
    .sort({ updatedAt: -1 }).select("_id messages createdAt updatedAt");
  success(res, { conversations }, "Conversations retrieved");
});

export const get = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
  if (!conversation) return failure(res, "Conversation not found", [], 404);
  success(res, { conversation }, "Conversation retrieved");
});