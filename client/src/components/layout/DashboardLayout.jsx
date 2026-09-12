import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AmbientBackground from "./AmbientBackground";

const titles = {
  "/dashboard": "Dashboard",
  "/dashboard/checkin": "Daily Check-in",
  "/dashboard/journal": "Journal",
  "/dashboard/insights": "AI Insights",
  "/dashboard/trends": "Mood & Stress Trends",
  "/dashboard/wellness-plan": "Wellness Plan",
  "/dashboard/assistant": "AI Assistant",
  "/dashboard/support": "Support Resources",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || (location.pathname.startsWith("/dashboard/journal") ? "Journal" : "MindGuard");

  return (
    <div className="min-h-screen">
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
