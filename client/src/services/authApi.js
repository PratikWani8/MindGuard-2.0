import api from "./api";

export const registerUser = (payload) =>
  api.post("/api/auth/register", payload);

export const loginUser = (payload) =>
  api.post("/api/auth/login", payload);

export const getMe = () =>
  api.get("/api/auth/me");

export const logoutUser = () =>
  api.post("/api/auth/logout");