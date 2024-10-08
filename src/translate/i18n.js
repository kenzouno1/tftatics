import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    // we init with resources

    fallbackLng: ["en"],
    whitelist: ["en", "vi", "ch"],
    debug: true,
    defaultLanguage: "en",
    lng: "en",
    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ","
    }
  });

export default i18n;
