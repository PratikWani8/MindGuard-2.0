import { useState } from "react";
import { User, Mail, Cake, CalendarDays, Save } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", age: user?.age || "" });
  const [saved, setSaved] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();
    setUser((u) => ({ ...u, ...form }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <GlassCard strong className="flex items-center gap-5">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center text-2xl font-display font-semibold">
          {(form.name || "M").charAt(0)}
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink-900">{form.name || "Your name"}</p>
          <p className="text-sm text-ink-400">Member since {user?.joinedAt || "recently"}</p>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="font-display font-semibold text-ink-900 mb-5">Account information</p>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1.5 block">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="name" value={form.name} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="email" type="email" value={form.email} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1.5 block">Age</label>
            <div className="relative">
              <Cake size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="age" type="number" value={form.age} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit"><Save size={15} /> Save changes</Button>
            {saved && <span className="text-xs text-emerald-600 font-medium">Saved ✓</span>}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="flex items-center gap-3">
        <CalendarDays size={18} className="text-violet-500" />
        <p className="text-sm text-ink-500">Your check-in streak and history are visible on your Dashboard and Trends pages.</p>
      </GlassCard>
    </div>
  );
}
