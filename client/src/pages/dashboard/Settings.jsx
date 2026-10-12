import { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  Sun,
  Moon,
  Globe,
  Palette,
  Check,
} from "lucide-react";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, changeAppLanguage } from "../../i18n";
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
          checked ? "left-[25px]" : "left-[3px]"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const { isDark, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

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
      {/* Theme and Language Settings */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
            <Palette size={18} className="text-violet-600 dark:text-violet-300" />
          </div>

          <div>
            <p className="font-display font-semibold text-ink-900 dark:text-white">
              {t("settings.appearanceAndLanguage", "Appearance & Language")}
            </p>
            <p className="text-xs text-ink-400 dark:text-gray-400">
              {t(
                "settings.appearanceAndLanguageSubtitle",
                "Customize your visual theme and preferred language."
              )}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Change Section */}
          <div>
            <div className="mb-3">
              <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
                {t("settings.themeTitle", "Appearance Theme")}
              </p>
              <p className="mt-0.5 text-xs text-ink-400 dark:text-gray-400">
                {t(
                  "settings.themeDesc",
                  "Switch between light and dark visual modes for your comfort."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Light Mode Button */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left focus-ring",
                  !isDark
                    ? "border-violet-500 bg-violet-50/80 dark:bg-violet-900/20 text-violet-900 dark:text-violet-200 shadow-sm ring-1 ring-violet-500/30"
                    : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-ink-700 dark:text-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      !isDark
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 dark:bg-white/10 text-ink-400 dark:text-gray-400"
                    )}
                  >
                    <Sun size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {t("settings.lightMode", "Light Mode")}
                    </p>
                    <p className="text-[11px] text-ink-400 dark:text-gray-400">
                      Clean & bright
                    </p>
                  </div>
                </div>

                {!isDark && (
                  <div className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Dark Mode Button */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left focus-ring",
                  isDark
                    ? "border-violet-500 bg-violet-500/10 text-violet-300 shadow-sm ring-1 ring-violet-500/30"
                    : "border-slate-200 hover:bg-slate-50 text-ink-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      isDark
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-ink-400"
                    )}
                  >
                    <Moon size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {t("settings.darkMode", "Dark Mode")}
                    </p>
                    <p className="text-[11px] text-ink-400 dark:text-gray-400">
                      Gentle on eyes
                    </p>
                  </div>
                </div>

                {isDark && (
                  <div className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="h-px bg-violet-100/70 dark:bg-white/10" />

          {/* Language Change Section */}
          <div>
            <div className="mb-3">
              <div className="flex items-center gap-1.5">
                <Globe size={16} className="text-violet-500" />
                <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
                  {t("settings.languageTitle", "Language Preference")}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-ink-400 dark:text-gray-400">
                {t(
                  "settings.languageDesc",
                  "Select your preferred language across the entire MindGuard platform."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeAppLanguage(lang.code)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border transition-all text-left focus-ring",
                      isSelected
                        ? "border-violet-500 bg-violet-50/80 dark:bg-violet-900/20 text-violet-900 dark:text-violet-200 shadow-sm ring-1 ring-violet-500/30"
                        : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-ink-700 dark:text-gray-300"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold">{lang.nativeLabel}</p>
                      <p className="text-[11px] text-ink-400 dark:text-gray-400">
                        {lang.label}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
            <Bell size={18} className="text-violet-600 dark:text-violet-300" />
          </div>

          <div>
            <p className="font-display font-semibold text-ink-900 dark:text-white">
              {t("settings.notifications", "Notifications")}
            </p>
            <p className="text-xs text-ink-400 dark:text-gray-400">
              {t("settings.notificationsDesc", "Choose what MindGuard can remind you about.")}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            {
              key: "dailyReminder",
              label: t("settings.dailyReminder", "Daily check-in reminder"),
              body: t("settings.dailyReminderDesc", "A gentle nudge if you haven't checked in yet today."),
            },
            {
              key: "weeklySummary",
              label: t("settings.weeklySummary", "Weekly summary"),
              body: t("settings.weeklySummaryDesc", "A recap of your mood, stress and sleep trends."),
            },
            {
              key: "insightAlerts",
              label: t("settings.insightAlerts", "New insight alerts"),
              body: t("settings.insightAlertsDesc", "Notify me when a new AI insight is available."),
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
                hover:bg-violet-50/50 dark:hover:bg-white/5
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
                  {n.label}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-ink-400 dark:text-gray-400">
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
            <ShieldCheck size={18} className="text-violet-600 dark:text-violet-300" />
          </div>

          <div>
            <p className="font-display font-semibold text-ink-900 dark:text-white">
              {t("settings.privacy", "Privacy")}
            </p>
            <p className="text-xs text-ink-400 dark:text-gray-400">
              {t("settings.privacyDesc", "Control how your MindGuard data is handled.")}
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
              hover:bg-violet-50/50 dark:hover:bg-white/5
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
                {t("settings.humanReview", "Allow human review if flagged")}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-ink-400 dark:text-gray-400">
                {t(
                  "settings.humanReviewDesc",
                  "Lets a trained moderator review elevated/urgent signals to arrange support."
                )}
              </p>
            </div>

            <Toggle
              checked={privacy.shareWithCounselor}
              label={t("settings.humanReview", "Allow human review if flagged")}
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
              hover:bg-violet-50/50 dark:hover:bg-white/5
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
                {t("settings.anonymizedResearch", "Contribute anonymized data to research")}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-ink-400 dark:text-gray-400">
                {t(
                  "settings.anonymizedResearchDesc",
                  "Helps improve MindGuard's models. Fully anonymized, optional."
                )}
              </p>
            </div>

            <Toggle
              checked={privacy.anonymizedResearch}
              label={t("settings.anonymizedResearch", "Contribute anonymized data to research")}
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
          <p className="font-display font-semibold text-ink-900 dark:text-white">
            {t("settings.dataControls", "Data controls")}
          </p>

          <p className="mt-1 text-xs text-ink-400 dark:text-gray-400">
            {t(
              "settings.dataControlsDesc",
              "Manage or remove the information associated with your account."
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            <Download size={15} />
            {t("settings.exportData", "Export my data")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="
              !text-calm-red
              !border-red-200 dark:!border-red-500/30
              hover:!bg-red-50 dark:hover:!bg-red-500/10
            "
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={15} />
            {t("settings.deleteData", "Delete all my data")}
          </Button>
        </div>

        {confirmDelete && (
          <div className="mt-4 rounded-xl border border-red-100 dark:border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                <Trash2 size={15} className="text-red-600 dark:text-red-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {t("settings.confirmDeleteTitle", "Delete all your data?")}
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                  {t(
                    "settings.confirmDeleteDesc",
                    "This permanently deletes all check-ins and journal entries. This can't be undone."
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                {t("settings.confirmDeleteBtn", "Yes, delete everything")}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                {t("common.cancel", "Cancel")}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Logout */}
      <GlassCard className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-ink-800 dark:text-gray-200">
            {t("settings.logoutTitle", "Log out of MindGuard")}
          </p>

          <p className="mt-0.5 text-xs text-ink-400 dark:text-gray-400">
            {t(
              "settings.logoutDesc",
              "You'll need to log in again to see your dashboard."
            )}
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={logout}>
          <LogOut size={15} />
          {t("common.logout", "Log out")}
        </Button>
      </GlassCard>
    </div>
  );
}