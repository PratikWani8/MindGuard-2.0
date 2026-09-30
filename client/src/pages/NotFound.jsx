import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import AmbientBackground from "../components/layout/AmbientBackground";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AmbientBackground variant="focus" />
      <GlassCard strong className="text-center max-w-sm">
        <div className="h-14 w-14 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 flex items-center justify-center mx-auto mb-4">
          <Compass size={26} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
          {t("notFound.title", "Page not found")}
        </h1>
        <p className="text-ink-400 dark:text-gray-400 text-sm mt-2">
          {t("notFound.desc", "The page you're looking for doesn't exist or has moved.")}
        </p>
        <Button as={Link} to="/" className="mt-6">
          {t("common.home")}
        </Button>
      </GlassCard>
    </div>
  );
}
