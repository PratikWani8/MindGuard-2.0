import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { SUPPORTED_LANGUAGES, changeAppLanguage } from "../../i18n";
import { cn } from "../../utils/cn";

export default function LanguageDropdown({ className, compact = false }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    changeAppLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block text-left z-50", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t("topbar.selectLanguage", "Select language")}
        title={t("topbar.selectLanguage", "Select language")}
        className={cn(
          "flex items-center gap-1.5 rounded-xl font-medium",
          "text-ink-700 dark:text-gray-200",
          "hover:bg-violet-50 dark:hover:bg-white/10",
          "hover:text-violet-600 dark:hover:text-violet-300",
          "border border-slate-200/80 dark:border-white/10",
          "bg-white/80 dark:bg-white/5",
          "focus-ring transition-all duration-200",
          compact ? "p-2" : "px-3 py-1.5 text-xs sm:text-sm"
        )}
      >
        <Globe size={17} className="text-violet-500 shrink-0" />
        {!compact && (
          <>
            <span className="font-semibold tracking-wide">
              {currentLang.nativeLabel}
            </span>
            <ChevronDown
              size={13}
              className={cn(
                "transition-transform duration-200 text-ink-400 dark:text-gray-400",
                isOpen && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-52 rounded-2xl p-2",
            "bg-white dark:bg-[#1e1d2b]",
            "border border-violet-200 dark:border-white/15",
            "shadow-2xl z-[100] animate-fade-up"
          )}
          style={{
            boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(124, 92, 230, 0.15)",
          }}
        >
          <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-gray-400 border-b border-slate-100 dark:border-white/10 mb-1">
            {t("languages.select", "Language")}
          </div>

          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-colors font-medium",
                    isSelected
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 font-semibold ring-1 ring-violet-500/20"
                      : "text-ink-800 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{lang.nativeLabel}</span>
                    <span className="text-xs text-ink-400 dark:text-gray-400 font-normal">
                      ({lang.label})
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-violet-600 dark:text-violet-400 shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
