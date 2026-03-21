import { Languages } from "lucide-react";
import { Locale } from "../../lib/i18n";

export const LanguageToggle = ({
  locale,
  onToggle
}: {
  locale: Locale;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-label={locale === "en" ? "Switch language to Vietnamese" : "Chuyen ngon ngu sang tieng Anh"}
    onClick={onToggle}
    className="relative flex h-14 min-w-20 items-center justify-center gap-2 border-[3px] border-amber-300 bg-slate-950 px-3 text-amber-100 shadow-[8px_8px_0_0_rgba(253,230,138,0.45)] transition hover:-translate-x-[2px] hover:-translate-y-[2px] dark:border-amber-100 dark:bg-slate-900"
  >
    <span className="absolute inset-[6px] border-2 border-amber-100/70" />
    <Languages className="relative z-10 h-4 w-4" />
    <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em]">
      {locale === "en" ? "VI" : "EN"}
    </span>
  </button>
);
