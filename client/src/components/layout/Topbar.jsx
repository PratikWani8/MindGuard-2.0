import {
  Menu,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navigate = useNavigate();

  return (
    <div className="glass-strong rounded-2xl px-4 md:px-6 py-3.5 flex items-center justify-between mb-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-violet-50 dark:hover:bg-white/10 focus-ring text-ink-700 dark:text-white"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="font-display font-semibold text-lg text-ink-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            p-2 rounded-xl
            text-ink-500 dark:text-gray-300
            hover:bg-violet-50 dark:hover:bg-white/10
            hover:text-violet-600 dark:hover:text-violet-300
            focus-ring
            transition-all duration-200
          "
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {isDark ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="
            h-9 w-9 rounded-full
            bg-gradient-to-br from-violet-400 to-aqua-400
            text-white
            flex items-center justify-center
            text-sm font-semibold
            focus-ring
          "
          title={user?.name}
        >
          {(user?.name || "M").charAt(0)}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="
            hidden sm:flex p-2 rounded-xl
            hover:bg-red-50 dark:hover:bg-red-500/10
            hover:text-calm-red
            focus-ring
            text-ink-400 dark:text-gray-400
          "
          aria-label="Log out"
        >
          <LogOut size={19} />
        </button>
      </div>
    </div>
  );
}