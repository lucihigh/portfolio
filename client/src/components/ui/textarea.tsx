import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-none border-[3px] border-slate-950 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,0.14)] outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-cyan-100 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[6px_6px_0_0_rgba(34,211,238,0.14)]",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
