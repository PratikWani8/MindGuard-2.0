import api, { USE_MOCKS, delay } from "./api";
import { recommendations, wellnessPlanToday } from "../data/mockData";

export async function fetchRecommendations() {
  if (USE_MOCKS) {
    await delay(450);
    return recommendations;
  }
  const { data } = await api.get("/wellness/recommendations");
  return data;
}

export async function fetchTodayPlan() {
  if (USE_MOCKS) {
    await delay(450);
    return wellnessPlanToday;
  }
  const { data } = await api.get("/wellness/plan/today");
  return data;
}

export async function toggleWellnessItem(itemId) {
  if (USE_MOCKS) {
    await delay(300);
    return { itemId, done: true };
  }
  const { data } = await api.patch(`/wellness/plan/items/${itemId}`);
  return data;
}
