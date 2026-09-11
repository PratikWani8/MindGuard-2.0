import axios from "axios";

const AI_BASE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

export const analyzeCheckIn = async (payload) => {
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/checkin/analyze`,
    payload,
    {
      timeout: 60000,
    }
  );

  return response.data;
};

export const analyzeJournal = async ({ userId, text }) => {
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/journal/analyze`,
    {
      userId,
      text,
    },
    {
      timeout: 60000,
    }
  );

  return response.data;
};

export const chatWithAI = async (payload) => {
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/chat`,
    payload,
    {
      timeout: 60000,
    }
  );

  return response.data;
};

export const reasonWithAgent = async ({
  userId,
  context,
}) => {
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/agent/reason`,
    {
      userId,
      context,
    },
    {
      timeout: 60000,
    }
  );

  return response.data;
};