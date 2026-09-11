import Conversation from "../models/Conversation.js";
import { chatWithAI } from "../services/aiService.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const chat = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message?.trim()) return failure(res, "Message is required", [], 400);

  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
    if (!conversation) return failure(res, "Conversation not found", [], 404);
  } else {
    conversation = await Conversation.create({ userId: req.user._id, messages: [] });
  }

  conversation.messages.push({ role: "user", content: message.trim() });

  const ai = await chatWithAI({
    userId: req.user._id.toString(),
    conversationId: conversation._id.toString(),
    message: message.trim(),
    history: conversation.messages.slice(-20).map(m => ({
      role: m.role, content: m.content
    }))
  });

  const result = ai.data || ai;
  const assistantMessage = result.message || "I’m unable to respond right now.";
  conversation.messages.push({ role: "assistant", content: assistantMessage });
  await conversation.save();

  success(res, {
    message: assistantMessage,
    sources: result.sources || [],
    conversationId: conversation._id
  }, "Chat response generated");
});