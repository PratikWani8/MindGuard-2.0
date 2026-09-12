import api from "./api";

export async function sendChatMessage(
  message,
  conversationId = null
) {

  const payload = {
    message,
  };


  if (conversationId) {

    payload.conversationId =
      conversationId;
  }

  const response =
    await api.post(
      "/api/chat",
      payload
    );


  const data =
    response.data?.data ||
    response.data;

  return {

    id:
      `a_${Date.now()}`,

    text:
      data.message ||
      "I’m unable to respond right now.",

    sources:
      data.sources || [],

    conversationId:
      data.conversationId || null,
  };
}