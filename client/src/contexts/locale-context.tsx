import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Locale, translateText } from "../lib/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (text: string | null | undefined) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_KEY = "portfolio_locale";

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem(LOCALE_KEY);
    return stored === "vi" ? "vi" : "en";
  });

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale === "vi" ? "vi" : "en";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === "en" ? "vi" : "en")),
      t: (text: string | null | undefined) => translateText(text, locale)
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
};
