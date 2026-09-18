import api from "./api";

const data = (response) => response.data?.data || {};

export const fetchAdminOverview = async () => data(await api.get("/api/admin/overview"));
export const fetchAdminUsers = async (search = "") => data(await api.get("/api/admin/users", { params: { search } }));
export const updateAdminUserRole = async (userId, role) => data(await api.patch(`/api/admin/users/${userId}/role`, { role }));
export const fetchAdminRiskEvents = async (status = "") => data(await api.get("/api/admin/risk-events", { params: status ? { status } : {} }));
export const updateAdminRiskEventStatus = async (eventId, status) => data(await api.patch(`/api/admin/risk-events/${eventId}/status`, { status }));
export const fetchAdminAuditLogs = async () => data(await api.get("/api/admin/audit-logs"));
