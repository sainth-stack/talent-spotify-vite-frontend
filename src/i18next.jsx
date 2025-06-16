// src / i18n.js;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import es from "./locales/es.json";
import ar from "./locales/ar.json";
import tel from "./locales/tel.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    es: { translation: es },
    ar: { translation: ar },
    tel: { translation: tel },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
  react: {
    useSuspense: false, // set to true if using Suspense/lazy loading
  },
});

export default i18n;
