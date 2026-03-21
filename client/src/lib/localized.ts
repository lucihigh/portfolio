import { Locale } from "./i18n";

export const localizeText = (locale: Locale, english?: string | null, vietnamese?: string | null) => {
  if (locale === "vi") {
    return (vietnamese && vietnamese.trim()) || english || "";
  }
  return english || vietnamese || "";
};

export const localizeList = (locale: Locale, english?: string[] | null, vietnamese?: string[] | null) => {
  if (locale === "vi" && vietnamese && vietnamese.length > 0) return vietnamese;
  if (english && english.length > 0) return english;
  return vietnamese || [];
};
