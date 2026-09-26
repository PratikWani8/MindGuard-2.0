import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

export const LANGUAGE_STORAGE_KEY = "mindguard-language";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
];

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = ["en", "hi", "mr"].includes(savedLanguage)
  ? savedLanguage
  : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safely escapes values
  },
});

export const changeAppLanguage = (languageCode) => {
  if (["en", "hi", "mr"].includes(languageCode)) {
    i18n.changeLanguage(languageCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    document.documentElement.lang = languageCode;
  }
};

// Set initial html lang attribute
document.documentElement.lang = initialLanguage;

export default i18n;
