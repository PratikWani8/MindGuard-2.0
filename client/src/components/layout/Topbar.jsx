import { Menu, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="glass-strong rounded-2xl px-4 md:px-6 py-3.5 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-violet-50 focus-ring text-ink-700" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="font-display font-semibold text-lg text-ink-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl hover:bg-violet-50 focus-ring text-ink-500" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-400 to-aqua-400 text-white flex items-center justify-center text-sm font-semibold focus-ring"
          title={user?.name}
        >
          {(user?.name || "M").charAt(0)}
        </button>
        <button onClick={logout} className="hidden sm:flex p-2 rounded-xl hover:bg-red-50 hover:text-calm-red focus-ring text-ink-400" aria-label="Log out">
          <LogOut size={19} />
        </button>
      </div>
    </div>
  );
}
