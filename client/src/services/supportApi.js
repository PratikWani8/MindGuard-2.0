import api, { USE_MOCKS, delay } from "./api";
import { supportResources } from "../data/mockData";

export async function fetchSupportResources() {
  if (USE_MOCKS) {
    await delay(500);
    return supportResources;
  }
  const { data } = await api.get("/support/resources");
  return data;
}

export async function requestHumanEscalation(payload) {
  if (USE_MOCKS) {
    await delay(700);
    return { status: "queued", ...payload };
  }
  const { data } = await api.post("/support/escalate", payload);
  return data;
}
