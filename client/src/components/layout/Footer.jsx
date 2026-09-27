import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-24 border-t border-violet-100/60 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-ink-900 dark:text-white mb-2">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
              <img
                src="/logo.png"
                alt="MindGuard"
                className="h-9 w-9 object-contain"
              />
            </span>
            {t("common.appName")}
          </div>
          <p className="text-ink-400 dark:text-gray-400 max-w-xs">
            {t("footer.disclaimer")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink-700 dark:text-gray-200 mb-2">{t("footer.product")}</p>
          <ul className="space-y-1.5 text-ink-400 dark:text-gray-400">
            <li><Link to="/how-it-works" className="hover:text-violet-600 dark:hover:text-violet-400">{t("footer.howItWorks")}</Link></li>
            <li><Link to="/about" className="hover:text-violet-600 dark:hover:text-violet-400">{t("footer.about")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-700 dark:text-gray-200 mb-2">{t("footer.trust")}</p>
          <ul className="space-y-1.5 text-ink-400 dark:text-gray-400">
            <li><Link to="/privacy" className="hover:text-violet-600 dark:hover:text-violet-400">{t("footer.privacy")}</Link></li>
            <li><Link to="/support" className="hover:text-violet-600 dark:hover:text-violet-400">{t("footer.support")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-700 dark:text-gray-200 mb-2">{t("footer.needHelpNow")}</p>
          <p className="text-ink-400 dark:text-gray-400">{t("footer.emergencyNotice")}</p>
        </div>
      </div>
      <div className="text-center text-xs text-ink-300 dark:text-gray-500 pb-6">{t("footer.copyright")}</div>
    </footer>
  );
}
