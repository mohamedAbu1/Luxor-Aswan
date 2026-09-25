/* eslint-disable react-hooks/set-state-in-effect */
// context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en"); // الافتراضي
  const pathname = usePathname();

  useEffect(() => {
    const pathLang = pathname.split("/").filter(Boolean)[0];
    const supported = ["en", "es", "fr", "de", "it", "zh", "ar"];
    const browserLang = navigator.language.split("-")[0];
    const nextLang = supported.includes(pathLang) ? pathLang : supported.includes(browserLang) ? browserLang : "en";
    setLang(nextLang);
    i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
