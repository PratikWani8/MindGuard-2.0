import { useState } from "react";
import { Bell, ShieldCheck, Download, Trash2, LogOut } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn("h-6 w-11 rounded-full transition-colors relative focus-ring", checked ? "bg-violet-500" : "bg-ink-300/40")}
      role="switch" aria-checked={checked}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const [notifs, setNotifs] = useState({ dailyReminder: true, weeklySummary: true, insightAlerts: false });
  const [privacy, setPrivacy] = useState({ shareWithCounselor: true, anonymizedResearch: false });
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-violet-600" />
          <p className="font-display font-semibold text-ink-900">Notifications</p>
        </div>
        <div className="space-y-4">
          {[
            { key: "dailyReminder", label: "Daily check-in reminder", body: "A gentle nudge if you haven't checked in yet today." },
            { key: "weeklySummary", label: "Weekly summary", body: "A recap of your mood, stress and sleep trends." },
            { key: "insightAlerts", label: "New insight alerts", body: "Notify me when a new AI insight is available." },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-800">{n.label}</p>
                <p className="text-xs text-ink-400">{n.body}</p>
              </div>
              <Toggle checked={notifs[n.key]} onChange={(v) => setNotifs((p) => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-violet-600" />
          <p className="font-display font-semibold text-ink-900">Privacy</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-800">Allow human review if flagged</p>
              <p className="text-xs text-ink-400">Lets a trained moderator review elevated/urgent signals to arrange support.</p>
            </div>
            <Toggle checked={privacy.shareWithCounselor} onChange={(v) => setPrivacy((p) => ({ ...p, shareWithCounselor: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-800">Contribute anonymized data to research</p>
              <p className="text-xs text-ink-400">Helps improve MindGuard's models. Fully anonymized, optional.</p>
            </div>
            <Toggle checked={privacy.anonymizedResearch} onChange={(v) => setPrivacy((p) => ({ ...p, anonymizedResearch: v }))} />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="font-display font-semibold text-ink-900 mb-4">Data controls</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm"><Download size={15} /> Export my data</Button>
          <Button variant="outline" size="sm" className="!text-calm-red !border-red-200 hover:!bg-red-50" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={15} /> Delete all my data
          </Button>
        </div>
        {confirmDelete && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm text-red-700">This permanently deletes all check-ins and journal entries. This can't be undone.</p>
            <div className="flex gap-2 mt-3">
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(false)}>Yes, delete everything</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-800">Log out of MindGuard</p>
          <p className="text-xs text-ink-400">You'll need to log in again to see your dashboard.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}><LogOut size={15} /> Log out</Button>
      </GlassCard>
    </div>
  );
}
