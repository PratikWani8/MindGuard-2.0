import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  BookOpen,
  Sparkles,
  TrendingUp,
  Leaf,
  MessagesSquare,
  Music2,
  LifeBuoy,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors focus-ring",
          isActive
            ? "bg-gradient-to-br from-violet-500 to-aqua-500 text-white shadow-soft"
            : "text-ink-500 hover:bg-violet-50 hover:text-ink-800"
        )
      }
    >
      <Icon size={18} strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const items = [
    { to: "/dashboard", label: t("common.dashboard", "Dashboard"), icon: LayoutDashboard, end: true },
    { to: "/dashboard/checkin", label: t("common.dailyCheckin", "Daily Check-in"), icon: PenSquare },
    { to: "/dashboard/journal", label: t("common.journal", "Journal"), icon: BookOpen },
    { to: "/dashboard/insights", label: t("common.insights", "AI Insights"), icon: Sparkles },
    { to: "/dashboard/trends", label: t("common.trends", "Trends"), icon: TrendingUp },
    { to: "/dashboard/wellness-plan", label: t("common.wellnessPlan", "Wellness Plan"), icon: Leaf },
    { to: "/dashboard/assistant", label: t("common.assistant", "AI Assistant"), icon: MessagesSquare },
    { to: "/dashboard/mind-relax", label: t("common.mindRelax", "Mind Relax"), icon: Music2 },
    { to: "/dashboard/support", label: t("common.support", "Support"), icon: LifeBuoy },
  ];

  const bottomItems = [
    { to: "/dashboard/profile", label: t("common.profile", "Profile"), icon: User },
    { to: "/dashboard/settings", label: t("common.settings", "Settings"), icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full glass-strong rounded-3xl p-4">
      <div className="flex items-center gap-2 font-display font-semibold text-ink-900 px-2 py-2 mb-4">
        <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
          <img
            src="/logo.png"
            alt="MindGuard"
            className="h-9 w-9 object-contain"
          />
        </span>
        MindGuard
      </div>

      <nav className="flex-1 flex flex-col gap-1" onClick={onNavigate}>
        {items.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}
      </nav>

      <div className="h-px bg-violet-100 my-3" />

      <nav className="flex flex-col gap-1" onClick={onNavigate}>
        {bottomItems.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}
        {user?.role === "admin" && (
          <NavItem to="/dashboard/admin" label={t("common.administration", "Administration")} icon={ShieldCheck} />
        )}
      </nav>
    </div>
  );
}
