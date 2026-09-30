import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import AmbientBackground from "../../components/layout/AmbientBackground";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError(t("auth.enterEmailAndPassword"));
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Couldn't log you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <AmbientBackground variant="focus" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-semibold text-ink-900 dark:text-white mb-6">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
            <img
              src="/logo.png"
              alt="MindGuard"
              className="h-9 w-9 object-contain"
            />
          </span>
          {t("common.appName")}
        </Link>

        <GlassCard strong>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white text-center">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-ink-400 dark:text-gray-400 text-sm text-center mt-1.5">
            {t("auth.loginSubtitle")}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="text-xs font-medium text-ink-600 dark:text-gray-300 mb-1.5 block">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.75 rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium text-ink-600 dark:text-gray-300 mb-1.5 block">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                  value={form.password} onChange={onChange} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.75 rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-calm-red bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("auth.loggingIn") : t("auth.logIn")} {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-400 dark:text-gray-400 mt-6">
            {t("auth.newToMindGuard")}{" "}
            <Link to="/register" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
              {t("auth.createAccount")}
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
