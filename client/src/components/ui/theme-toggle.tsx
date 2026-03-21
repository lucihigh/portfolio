import { Moon, Sun } from "lucide-react";

export const ThemeToggle = ({
  darkMode,
  onToggle
}: {
  darkMode: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    onClick={onToggle}
    className="relative grid h-14 w-14 place-items-center border-[3px] border-cyan-300 bg-slate-950 text-cyan-100 shadow-[8px_8px_0_0_rgba(103,232,249,0.45)] transition hover:-translate-x-[2px] hover:-translate-y-[2px] dark:border-cyan-100 dark:bg-slate-900"
  >
    <span className="absolute inset-[6px] border-2 border-cyan-100/70" />
    {darkMode ? <Sun className="relative z-10 h-5 w-5" /> : <Moon className="relative z-10 h-5 w-5" />}
  </button>
);
