import api from "./api";

// Run the MindGuard AI Agent
export const runAgent = async () => {
  const response = await api.post("/api/agent/run");
  return response.data;
};

// Get the latest agent decision
export const getLatestAgentDecision = async () => {
  const response = await api.get("/api/agent/latest");
  return response.data;
};

// Get previous agent decisions
export const getAgentHistory = async () => {
  const response = await api.get("/api/agent/history");
  return response.data;
};

// Get pending follow-ups
export const getAgentFollowUps = async () => {
  const response = await api.get("/api/agent/followups");
  return response.data;
};

// Get active wellness plan
export const getWellnessPlan = async () => {
  const response = await api.get("/api/agent/wellness-plan");
  return response.data;
};