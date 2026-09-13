import { useEffect, useState } from "react";
import {
  BookOpen,
  Stethoscope,
  Siren,
  Users,
  ArrowUpRight,
  PhoneCall,
} from "lucide-react";

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
    fetchSupportResources()
      .then((r) => {
        setResources(r);
        setLoading(false);
      })
      .catch(() => {
        setResources([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* ============================================================
          EMERGENCY BANNER
          ============================================================ */}
      <GlassCard
        strong
        className="
          flex
          flex-col
          gap-4
          border-2
          border-red-100
          bg-red-50/50
          sm:flex-row
          sm:items-center

          dark:border-red-900/50
          dark:bg-red-950/20
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-red-50
            text-calm-red

            dark:bg-red-950/50
            dark:text-red-400
          "
        >
          <PhoneCall size={22} />
        </div>

        <div className="flex-1">
          <p
            className="
              font-display
              font-semibold
              text-ink-900

              dark:text-gray-100
            "
          >
            In immediate danger or crisis?
          </p>

          <p
            className="
              mt-0.5
              text-sm
              text-ink-500

              dark:text-gray-300
            "
          >
            Contact local emergency services or a crisis helpline right away -
            don't wait for a check-in.
          </p>
        </div>

        <Button variant="danger">Get emergency help</Button>
      </GlassCard>

      {/* ============================================================
          SUPPORT RESOURCES
          ============================================================ */}
      {loading ? (
        <LoadingSpinner label="Loading resources" size="lg" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {resources.map((cat) => {
            const Icon = categoryIcon[cat.category] || BookOpen;

            return (
              <GlassCard
                key={cat.category}
                className="
                  support-category
                  border

                  dark:border-[#3b3657]
                  dark:bg-[#1f1d2b]
                "
              >
                {/* Category heading */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-violet-100
                      text-violet-600

                      dark:bg-violet-950/60
                      dark:text-violet-300
                    "
                  >
                    <Icon size={18} />
                  </div>

                  <p
                    className="
                      font-display
                      font-semibold
                      text-ink-900

                      dark:text-gray-100
                    "
                  >
                    {cat.category}
                  </p>
                </div>

                {/* Resource links */}
                <div className="space-y-2.5">
                  {cat.items.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-transparent
                        bg-white/60
                        px-3.5
                        py-3
                        transition-colors

                        hover:bg-white

                        dark:border-[#3b3650]
                        dark:bg-[#272532]
                        dark:hover:border-[#514a73]
                        dark:hover:bg-[#302c3e]
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-sm
                            font-medium
                            text-ink-800

                            dark:text-gray-100
                          "
                        >
                          {item.title}
                        </p>

                        <p
                          className="
                            text-xs
                            text-ink-400

                            dark:text-violet-300
                          "
                        >
                          {item.type}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="
                          ml-3
                          shrink-0
                          text-ink-300
                          transition-colors

                          group-hover:text-violet-500

                          dark:text-gray-400
                          dark:group-hover:text-violet-300
                        "
                      />
                    </a>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ============================================================
          HUMAN REVIEW
          ============================================================ */}
      <GlassCard
        className="
          py-8
          text-center

          dark:border-[#3b3657]
          dark:bg-[#1f1d2b]
        "
      >
        <p
          className="
            mx-auto
            max-w-md
            text-sm
            text-ink-500

            dark:text-gray-300
          "
        >
          Want a real person to review your recent check-ins? You can request
          a confidential human review at any time - someone from our support
          team will reach out.
        </p>

        <Button
          variant="secondary"
          className="mt-4"
        >
          Request human review
        </Button>
      </GlassCard>
    </div>
  );
}