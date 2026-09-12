import { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex-shrink-0",
        "h-[26px] w-12",
        "rounded-full",
        "border",
        "transition-all duration-300 ease-out",
        "active:scale-95",
        checked
          ? "border-green-500 bg-green-500 shadow-[0_3px_10px_rgba(34,197,94,0.30)]"
          : "border-ink-200 bg-ink-200/70 shadow-inner hover:bg-ink-300/70"
      )}
    >
      <span
        className={cn(
          "absolute top-[3px]",
          "h-[18px] w-[18px]",
          "rounded-full",
          "bg-white",
          "shadow-[0_2px_5px_rgba(0,0,0,0.18)]",
          "transition-all duration-300 ease-out",
          checked
            ? "left-[25px]"
            : "left-[3px]"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const { logout } = useAuth();

  const [notifs, setNotifs] = useState({
    dailyReminder: true,
    weeklySummary: true,
    insightAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    shareWithCounselor: true,
    anonymizedResearch: false,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Notifications */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
            <Bell size={18} className="text-violet-600" />
          </div>

          <div>
            <p className="font-display font-semibold text-ink-900">
              Notifications
            </p>
            <p className="text-xs text-ink-400">
              Choose what MindGuard can remind you about.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            {
              key: "dailyReminder",
              label: "Daily check-in reminder",
              body: "A gentle nudge if you haven't checked in yet today.",
            },
            {
              key: "weeklySummary",
              label: "Weekly summary",
              body: "A recap of your mood, stress and sleep trends.",
            },
            {
              key: "insightAlerts",
              label: "New insight alerts",
              body: "Notify me when a new AI insight is available.",
            },
          ].map((n) => (
            <div
              key={n.key}
              className="
                flex items-center justify-between
                gap-6
                rounded-xl
                px-3 py-3
                -mx-3
                transition-colors
                hover:bg-violet-50/50
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-800">
                  {n.label}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-ink-400">
                  {n.body}
                </p>
              </div>

              <Toggle
                checked={notifs[n.key]}
                label={n.label}
                onChange={(value) =>
                  setNotifs((previous) => ({
                    ...previous,
                    [n.key]: value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Privacy */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
            <ShieldCheck size={18} className="text-violet-600" />
          </div>

          <div>
            <p className="font-display font-semibold text-ink-900">
              Privacy
            </p>
            <p className="text-xs text-ink-400">
              Control how your MindGuard data is handled.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div
            className="
              flex items-center justify-between
              gap-6
              rounded-xl
              px-3 py-3
              -mx-3
              transition-colors
              hover:bg-violet-50/50
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-800">
                Allow human review if flagged
              </p>

              <p className="mt-0.5 text-xs leading-5 text-ink-400">
                Lets a trained moderator review elevated/urgent signals to
                arrange support.
              </p>
            </div>

            <Toggle
              checked={privacy.shareWithCounselor}
              label="Allow human review if flagged"
              onChange={(value) =>
                setPrivacy((previous) => ({
                  ...previous,
                  shareWithCounselor: value,
                }))
              }
            />
          </div>

          <div
            className="
              flex items-center justify-between
              gap-6
              rounded-xl
              px-3 py-3
              -mx-3
              transition-colors
              hover:bg-violet-50/50
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-800">
                Contribute anonymized data to research
              </p>

              <p className="mt-0.5 text-xs leading-5 text-ink-400">
                Helps improve MindGuard's models. Fully anonymized, optional.
              </p>
            </div>

            <Toggle
              checked={privacy.anonymizedResearch}
              label="Contribute anonymized data to research"
              onChange={(value) =>
                setPrivacy((previous) => ({
                  ...previous,
                  anonymizedResearch: value,
                }))
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* Data Controls */}
      <GlassCard>
        <div className="mb-4">
          <p className="font-display font-semibold text-ink-900">
            Data controls
          </p>

          <p className="mt-1 text-xs text-ink-400">
            Manage or remove the information associated with your account.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            <Download size={15} />
            Export my data
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="
              !text-calm-red
              !border-red-200
              hover:!bg-red-50
            "
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={15} />
            Delete all my data
          </Button>
        </div>

        {confirmDelete && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                <Trash2 size={15} className="text-red-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-red-800">
                  Delete all your data?
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  This permanently deletes all check-ins and journal entries.
                  This can't be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Yes, delete everything
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Logout */}
      <GlassCard className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-ink-800">
            Log out of MindGuard
          </p>

          <p className="mt-0.5 text-xs text-ink-400">
            You'll need to log in again to see your dashboard.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={logout}
        >
          <LogOut size={15} />
          Log out
        </Button>
      </GlassCard>
    </div>
  );
}