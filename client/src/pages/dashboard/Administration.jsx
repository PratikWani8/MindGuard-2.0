import { useCallback, useEffect, useState } from "react";
import { Activity, AlertTriangle, Database, RefreshCw, ShieldCheck, Users } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  fetchAdminAuditLogs,
  fetchAdminOverview,
  fetchAdminRiskEvents,
  fetchAdminUsers,
  updateAdminRiskEventStatus,
  updateAdminUserRole,
} from "../../services/adminApi";

const supportClass = {
  stable: "bg-emerald-100 text-emerald-700",
  needs_attention: "bg-amber-100 text-amber-700",
  elevated: "bg-orange-100 text-orange-700",
  urgent_support: "bg-red-100 text-red-700",
};

const formatLabel = (value) => value?.replaceAll("_", " ") || "—";
const formatDate = (value) => (value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—");

function Metric({ icon: Icon, label, value, accent = "violet" }) {
  const accents = {
    violet: "bg-violet-100 text-violet-600",
    aqua: "bg-aqua-400/20 text-aqua-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-calm-red",
  };
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
          <p className="font-display text-2xl font-semibold text-ink-900 mt-1">{value ?? 0}</p>
        </div>
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${accents[accent]}`}><Icon size={20} /></div>
      </div>
    </GlassCard>
  );
}

export default function Administration() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("open");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const [nextOverview, nextUsers, nextEvents, nextLogs] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminUsers(search),
        fetchAdminRiskEvents(riskFilter),
        fetchAdminAuditLogs(),
      ]);
      setOverview(nextOverview);
      setUsers(nextUsers.users || []);
      setEvents(nextEvents.events || []);
      setLogs(nextLogs.logs || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The administration data could not be loaded.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [riskFilter, search]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (userId, role) => {
    setSavingId(userId);
    try {
      await updateAdminUserRole(userId, role);
      await load(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The user role could not be updated.");
    } finally {
      setSavingId("");
    }
  };

  const changeRiskStatus = async (eventId, status) => {
    setSavingId(eventId);
    try {
      await updateAdminRiskEventStatus(eventId, status);
      await load(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The event status could not be updated.");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <LoadingSpinner label="Loading administration" size="lg" />;
  if (!overview && error) return <ErrorState message={error} onRetry={() => load()} />;

  const metrics = overview?.metrics || {};
  const activity = overview?.activity || [];
  const maxActivity = Math.max(...activity.map((item) => item.checkIns), 1);

  return (
    <div className="space-y-6">
      <GlassCard strong className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-600">Restricted area</p>
          <h2 className="font-display text-2xl font-semibold text-ink-900 mt-1">Administration center</h2>
          <p className="text-sm text-ink-500 mt-1">Monitor service activity, review support signals, and manage access without exposing journal content.</p>
        </div>
        <Button variant="outline" onClick={() => load(true)} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
        </Button>
      </GlassCard>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-calm-red">{error}</div>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric icon={Users} label="Registered users" value={metrics.totalUsers} />
        <Metric icon={Activity} label="Check-ins, 7 days" value={metrics.checkInsThisWeek} accent="aqua" />
        <Metric icon={AlertTriangle} label="Open support signals" value={metrics.openRiskEvents} accent="amber" />
        <Metric icon={ShieldCheck} label="Urgent signals open" value={metrics.urgentOpenEvents} accent="red" />
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        <GlassCard className="xl:col-span-3">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div><h3 className="font-display font-semibold text-ink-900">Operational activity</h3><p className="text-sm text-ink-400 mt-1">Completed check-ins over the last seven days.</p></div>
            <div className="text-right"><p className="text-xs text-ink-400">AI analyses</p><p className="font-semibold text-ink-800">{metrics.analysesThisWeek || 0}</p></div>
          </div>
          <div className="h-44 flex items-end gap-3">
            {activity.map((item) => (
              <div key={item.date} className="flex-1 min-w-0 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs text-ink-500">{item.checkIns}</span>
                <div className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-violet-500 to-aqua-400" style={{ height: `${Math.max((item.checkIns / maxActivity) * 112, item.checkIns ? 10 : 2)}px` }} />
                <span className="text-[10px] text-ink-400">{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="xl:col-span-2">
          <div className="flex items-center gap-3 mb-4"><Database className="text-violet-600" size={20} /><div><h3 className="font-display font-semibold text-ink-900">Data operations</h3><p className="text-xs text-ink-400">Current 7-day intake</p></div></div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">New users</dt><dd className="font-medium text-ink-800">{metrics.newUsers || 0}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Journal entries</dt><dd className="font-medium text-ink-800">{metrics.journalsThisWeek || 0}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">AI analyses</dt><dd className="font-medium text-ink-800">{metrics.analysesThisWeek || 0}</dd></div>
          </dl>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5"><div><h3 className="font-display font-semibold text-ink-900">Support-signal queue</h3><p className="text-sm text-ink-400 mt-1">Administrative review only; these signals are not diagnoses.</p></div><select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm text-ink-700 focus-ring"><option value="">All statuses</option><option value="open">Open</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option></select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="text-left text-xs uppercase tracking-wide text-ink-400 border-b border-violet-100"><tr><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Signal</th><th className="pb-3 pr-4">Source</th><th className="pb-3 pr-4">Created</th><th className="pb-3">Status</th></tr></thead><tbody>{events.length ? events.map((event) => <tr key={event._id} className="border-b border-violet-50 last:border-0"><td className="py-4 pr-4"><p className="font-medium text-ink-800">{event.userId?.name || "Deleted user"}</p><p className="text-xs text-ink-400">{event.userId?.email || ""}</p></td><td className="py-4 pr-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${supportClass[event.supportLevel] || "bg-slate-100 text-slate-700"}`}>{formatLabel(event.supportLevel)}</span><p className="mt-1 max-w-sm text-xs text-ink-500 line-clamp-2">{event.reason}</p></td><td className="py-4 pr-4 capitalize text-ink-500">{event.source}</td><td className="py-4 pr-4 text-xs text-ink-500">{formatDate(event.createdAt)}</td><td className="py-4"><select value={event.status} disabled={savingId === event._id} onChange={(input) => changeRiskStatus(event._id, input.target.value)} className="rounded-lg border border-violet-100 bg-white px-2 py-1.5 text-xs text-ink-700 disabled:opacity-50"><option value="open">Open</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option></select></td></tr>) : <tr><td colSpan="5" className="py-8 text-center text-ink-400">No risk events match this filter.</td></tr>}</tbody></table></div>
      </GlassCard>

      <div className="grid xl:grid-cols-5 gap-6">
        <GlassCard className="xl:col-span-3"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5"><div><h3 className="font-display font-semibold text-ink-900">User access</h3><p className="text-sm text-ink-400 mt-1">Roles control access to restricted functionality.</p></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm text-ink-700 focus-ring" /></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="text-left text-xs uppercase tracking-wide text-ink-400 border-b border-violet-100"><tr><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Joined</th><th className="pb-3">Role</th></tr></thead><tbody>{users.map((user) => <tr key={user._id} className="border-b border-violet-50 last:border-0"><td className="py-3.5 pr-4"><p className="font-medium text-ink-800">{user.name}</p><p className="text-xs text-ink-400">{user.email}</p></td><td className="py-3.5 pr-4 text-xs text-ink-500">{formatDate(user.createdAt)}</td><td className="py-3.5"><select value={user.role} disabled={savingId === user._id} onChange={(input) => changeRole(user._id, input.target.value)} className="rounded-lg border border-violet-100 bg-white px-2 py-1.5 text-xs text-ink-700 disabled:opacity-50"><option value="user">User</option><option value="counselor">Counselor</option><option value="admin">Administrator</option></select></td></tr>)}</tbody></table></div></GlassCard>
        <GlassCard className="xl:col-span-2"><h3 className="font-display font-semibold text-ink-900">Recent administrator actions</h3><p className="text-sm text-ink-400 mt-1 mb-4">Audit log for operational accountability.</p><div className="space-y-4">{logs.length ? logs.slice(0, 6).map((log) => <div key={log._id} className="border-l-2 border-violet-200 pl-3"><p className="text-sm text-ink-700">{log.adminId?.name || "Administrator"} <span className="text-ink-400">{formatLabel(log.action)}</span></p><p className="text-xs text-ink-400 mt-1">{formatDate(log.createdAt)}</p></div>) : <p className="text-sm text-ink-400 py-4">No administrative actions have been recorded.</p>}</div></GlassCard>
      </div>
    </div>
  );
}
