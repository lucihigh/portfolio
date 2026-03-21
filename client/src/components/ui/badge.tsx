import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex rounded-none border-[2px] border-slate-950 bg-amber-200 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-950 shadow-[4px_4px_0_0_rgba(15,23,42,0.9)] dark:border-amber-100 dark:bg-amber-100",
      className
    )}
    style={{ fontFamily: '"Pixelify Sans", monospace' }}
    {...props}
  />
);
