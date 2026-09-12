import { useEffect, useState } from "react";
import { BookOpen, Stethoscope, Siren, Users, ArrowUpRight, PhoneCall } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchSupportResources } from "../../services/supportApi";

const categoryIcon = {
  "Mental health education": BookOpen,
  "Professional support": Stethoscope,
  "Emergency support": Siren,
  "Campus & community": Users,
};

export default function Support() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportResources().then((r) => { setResources(r); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <GlassCard strong className="border-2 border-red-100 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-calm-red flex items-center justify-center shrink-0">
          <PhoneCall size={22} />
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold text-ink-900">In immediate danger or crisis?</p>
          <p className="text-sm text-ink-500 mt-0.5">Contact local emergency services or a crisis helpline right away — don't wait for a check-in.</p>
        </div>
        <Button variant="danger">Get emergency help</Button>
      </GlassCard>

      {loading ? (
        <LoadingSpinner label="Loading resources" size="lg" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {resources.map((cat) => {
            const Icon = categoryIcon[cat.category] || BookOpen;
            return (
              <GlassCard key={cat.category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <p className="font-display font-semibold text-ink-900">{cat.category}</p>
                </div>
                <div className="space-y-2.5">
                  {cat.items.map((item) => (
                    <a key={item.title} href={item.link} className="flex items-center justify-between rounded-xl px-3.5 py-3 bg-white/60 hover:bg-white transition-colors group">
                      <div>
                        <p className="text-sm font-medium text-ink-800">{item.title}</p>
                        <p className="text-xs text-ink-400">{item.type}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-ink-300 group-hover:text-violet-500" />
                    </a>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <GlassCard className="text-center py-8">
        <p className="text-sm text-ink-500 max-w-md mx-auto">
          Want a real person to review your recent check-ins? You can request a confidential human review
          at any time — someone from our support team will reach out.
        </p>
        <Button variant="secondary" className="mt-4">Request human review</Button>
      </GlassCard>
    </div>
  );
}
