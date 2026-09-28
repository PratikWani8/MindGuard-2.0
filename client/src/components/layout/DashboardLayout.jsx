import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AmbientBackground from "./AmbientBackground";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const titles = {
    "/dashboard": t("common.dashboard", "Dashboard"),
    "/dashboard/checkin": t("common.dailyCheckin", "Daily Check-in"),
    "/dashboard/journal": t("common.journal", "Journal"),
    "/dashboard/insights": t("common.insights", "AI Insights"),
    "/dashboard/trends": t("common.trends", "Mood & Stress Trends"),
    "/dashboard/wellness-plan": t("common.wellnessPlan", "Wellness Plan"),
    "/dashboard/assistant": t("common.assistant", "AI Assistant"),
    "/dashboard/mind-relax": t("common.mindRelax", "Mind Relax"),
    "/dashboard/support": t("common.support", "Support Resources"),
    "/dashboard/profile": t("common.profile", "Profile"),
    "/dashboard/settings": t("common.settings", "Settings"),
    "/dashboard/admin": t("common.administration", "Administration"),
  };

  const title = titles[location.pathname] || (location.pathname.startsWith("/dashboard/journal") ? t("common.journal", "Journal") : "MindGuard");

  return (
    <div className="min-h-screen transition-colors duration-300">
      <AmbientBackground />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
          <Sidebar />
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 p-3">
              <div className="relative h-full">
                <button className="absolute -right-1 top-1 p-2 text-ink-500 z-10" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
                <Sidebar onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 pb-16">
          <Topbar onMenuClick={() => setOpen(true)} title={title} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
