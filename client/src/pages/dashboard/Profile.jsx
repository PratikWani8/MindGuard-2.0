import { useState } from "react";
import { User, Mail, Cake, CalendarDays, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { t } = useTranslation();
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
          <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">{form.name || t("profile.fullName")}</p>
          <p className="text-sm text-ink-400 dark:text-gray-400">
            {t("profile.memberSince", { date: user?.joinedAt || t("profile.recently") })}
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="font-display font-semibold text-ink-900 dark:text-white mb-5">{t("profile.accountInformation")}</p>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-gray-300 mb-1.5 block">{t("profile.fullName")}</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="name" value={form.name} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-gray-300 mb-1.5 block">{t("profile.email")}</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="email" type="email" value={form.email} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-gray-300 mb-1.5 block">{t("profile.age")}</label>
            <div className="relative">
              <Cake size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
              <input name="age" type="number" value={form.age} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sm text-ink-800 dark:text-gray-100 focus-ring focus:border-violet-300 dark:focus:border-violet-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit"><Save size={15} /> {t("profile.saveChanges")}</Button>
            {saved && <span className="text-xs text-emerald-600 font-medium">{t("profile.saved")}</span>}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="flex items-center gap-3">
        <CalendarDays size={18} className="text-violet-500" />
        <p className="text-sm text-ink-500 dark:text-gray-400">{t("profile.streakNote")}</p>
      </GlassCard>
    </div>
  );
}
