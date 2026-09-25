// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// استدعاء ملفات JSON
import en from "./src/locales/en/translation.json";
import es from "./src/locales/es/translation.json";
import fr from "./src/locales/fr/translation.json";
import de from "./src/locales/de/translation.json";
import it from "./src/locales/it/translation.json";
import zhCN from "./src/locales/zh/translation.json";
import ar from "./src/locales/ar/translation.json";

i18n
  .use(LanguageDetector) // يكتشف لغة المتصفح
  .use(initReactI18next) // يربط i18next بـ React
  .init({
    resources: {
      en: {
        header: en.header,
        home: en.home,
        footer: en.footer,
        trips: en.trips,
        about: en.about,
        contact: en.contact,
        TripsPage: en.TripsPage,
        visa: en.visa, // هنا تحط الـ visa keys
      },
      es: {
        header: es.header,
        home: es.home,
        footer: es.footer,
        trips: es.trips,
        about: es.about,
        contact: es.contact,
        visa: es.visa,
      },
      fr: {
        header: fr.header,
        home: fr.home,
        footer: fr.footer,
        trips: fr.trips,
        about: fr.about,
        contact: fr.contact,
        visa: fr.visa,
      },
      de: {
        header: de.header,
        home: de.home,
        footer: de.footer,
        trips: de.trips,
        about: de.about,
        contact: de.contact,
        visa: de.visa,
      },
      it: {
        header: it.header,
        home: it.home,
        footer: it.footer,
        trips: it.trips,
        about: it.about,
        contact: it.contact,
        visa: it.visa,
      },
      zh: {
        header: zhCN.header,
        home: zhCN.home,
        footer: zhCN.footer,
        trips: zhCN.trips,
        about: zhCN.about,
        contact: zhCN.contact,
        visa: zhCN.visa,
      },
      ar: { header: ar.header, home: ar.home, footer: ar.footer, trips: ar.trips, about: ar.about, contact: ar.contact, visa: ar.visa },
    },
    fallbackLng: "en", // اللغة الافتراضية لو اللغة غير موجودة
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "htmlTag", "cookie", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["cookie"],
    },
  });

export default i18n;
