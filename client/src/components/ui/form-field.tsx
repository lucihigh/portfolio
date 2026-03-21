import { ReactNode } from "react";

export const FormField = ({
  label,
  error,
  children,
  hint
}: {
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>
    {children}
    {hint ? <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    {error ? <p className="text-xs text-rose-500">{error}</p> : null}
  </label>
);
