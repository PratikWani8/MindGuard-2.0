import User from "../models/User.js";
import CheckIn from "../models/CheckIn.js";
import Journal from "../models/Journal.js";
import AIAnalysis from "../models/AIAnalysis.js";
import RiskEvent from "../models/RiskEvent.js";
import AdminAuditLog from "../models/AdminAuditLog.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validRoles = ["user", "counselor", "admin"];
const validRiskStatuses = ["open", "reviewed", "resolved"];

export const overview = asyncHandler(async (_req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    newUsers,
    checkInsThisWeek,
    journalsThisWeek,
    analysesThisWeek,
    riskBreakdown,
    recentRiskEvents,
    dailyActivity,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    CheckIn.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Journal.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    AIAnalysis.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    RiskEvent.aggregate([{ $group: { _id: { supportLevel: "$supportLevel", status: "$status" }, count: { $sum: 1 } } }]),
    RiskEvent.find({ status: { $in: ["open", "reviewed"] } })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("userId", "name email")
      .select("userId source supportLevel reason status createdAt"),
    CheckIn.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, checkIns: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const riskSummary = riskBreakdown.reduce(
    (summary, item) => {
      const key = `${item._id.supportLevel}:${item._id.status}`;
      summary[key] = item.count;
      return summary;
    },
    {}
  );

  const activityByDay = new Map(dailyActivity.map((item) => [item._id, item.checkIns]));
  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    const day = date.toISOString().slice(0, 10);
    return { date: day, checkIns: activityByDay.get(day) || 0 };
  });

  success(res, {
    metrics: {
      totalUsers,
      newUsers,
      checkInsThisWeek,
      journalsThisWeek,
      analysesThisWeek,
      openRiskEvents: (riskSummary["needs_attention:open"] || 0) + (riskSummary["elevated:open"] || 0) + (riskSummary["urgent_support:open"] || 0),
      urgentOpenEvents: riskSummary["urgent_support:open"] || 0,
    },
    riskSummary,
    recentRiskEvents,
    activity,
  }, "Administration overview retrieved");
});

export const listUsers = asyncHandler(async (req, res) => {
  const search = String(req.query.search || "").trim();
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
    : {};

  const users = await User.find(filter)
    .select("name email role age createdAt")
    .sort({ createdAt: -1 })
    .limit(100);

  success(res, { users }, "Users retrieved");
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!validRoles.includes(role)) return failure(res, "A valid role is required", [], 400);
  if (String(req.user._id) === String(req.params.userId)) {
    return failure(res, "You cannot change your own administrator role", [], 400);
  }

  const user = await User.findById(req.params.userId);
  if (!user) return failure(res, "User not found", [], 404);

  const previousRole = user.role;
  user.role = role;
  await user.save();
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: "user_role_updated",
    targetType: "user",
    targetId: user._id,
    metadata: { previousRole, role },
  });

  success(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role } }, "User role updated");
});

export const listRiskEvents = asyncHandler(async (req, res) => {
  const filter = {};
  if (validRiskStatuses.includes(req.query.status)) filter.status = req.query.status;
  if (["stable", "needs_attention", "elevated", "urgent_support"].includes(req.query.supportLevel)) {
    filter.supportLevel = req.query.supportLevel;
  }

  const events = await RiskEvent.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("userId", "name email")
    .select("userId source supportLevel reason status createdAt updatedAt");
  success(res, { events }, "Risk events retrieved");
});

export const updateRiskEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!validRiskStatuses.includes(status)) return failure(res, "A valid risk-event status is required", [], 400);

  const event = await RiskEvent.findById(req.params.eventId);
  if (!event) return failure(res, "Risk event not found", [], 404);

  const previousStatus = event.status;
  event.status = status;
  await event.save();
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: "risk_event_status_updated",
    targetType: "risk_event",
    targetId: event._id,
    metadata: { previousStatus, status },
  });

  success(res, { event }, "Risk event status updated");
});

export const listAuditLogs = asyncHandler(async (_req, res) => {
  const logs = await AdminAuditLog.find()
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("adminId", "name email")
    .select("adminId action targetType targetId metadata createdAt");
  success(res, { logs }, "Administration audit log retrieved");
});
