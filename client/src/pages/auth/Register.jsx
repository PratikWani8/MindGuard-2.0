import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Cake, ArrowRight, Eye, EyeOff } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import AmbientBackground from "../../components/layout/AmbientBackground";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", age: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <AmbientBackground variant="focus" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-semibold text-ink-900 mb-6">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
            <img
          src="/logo.png"
          alt="MindGuard"
          className="h-9 w-9 object-contain"
        />
          </span>
          MindGuard
        </Link>

        <GlassCard strong>
          <h1 className="font-display text-2xl font-semibold text-ink-900 text-center">Create your account</h1>
          <p className="text-ink-400 text-sm text-center mt-1.5">Two minutes a day is all MindGuard needs to start noticing patterns.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="text-xs font-medium text-ink-600 mb-1.5 block">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Aarav Mehta"
                  className="w-full pl-10 pr-4 py-2.75 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label htmlFor="email" className="text-xs font-medium text-ink-600 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.75 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
                </div>
              </div>
              <div>
                <label htmlFor="age" className="text-xs font-medium text-ink-600 mb-1.5 block">Age</label>
                <div className="relative">
                  <Cake size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input id="age" name="age" type="number" min="13" max="99" value={form.age} onChange={onChange} placeholder="21"
                    className="w-full pl-8 pr-2 py-2.75 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium text-ink-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={onChange} placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.75 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-calm-red bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Create account"} {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-300 mt-5">
            By continuing you agree this is a wellbeing-support tool, not a substitute for professional care.
          </p>
          <p className="text-center text-sm text-ink-400 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-medium hover:underline">Log in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
