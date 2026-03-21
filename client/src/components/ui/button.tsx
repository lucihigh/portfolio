import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-none border-[3px] px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 active:translate-x-[2px] active:translate-y-[2px]",
        variant === "default" &&
          "border-slate-950 bg-cyan-400 text-slate-950 shadow-pixel hover:-translate-x-[2px] hover:-translate-y-[2px] dark:border-cyan-100 dark:bg-cyan-300",
        variant === "outline" &&
          "border-slate-950 bg-white text-slate-950 shadow-[6px_6px_0_0_rgba(15,23,42,0.9)] hover:-translate-x-[2px] hover:-translate-y-[2px] dark:border-cyan-100 dark:bg-slate-950 dark:text-cyan-100 dark:shadow-[6px_6px_0_0_rgba(34,211,238,0.35)]",
        variant === "ghost" &&
          "border-transparent bg-transparent text-slate-700 hover:border-slate-950 hover:bg-cyan-100 dark:text-slate-200 dark:hover:border-cyan-200 dark:hover:bg-slate-800",
        variant === "destructive" &&
          "border-slate-950 bg-rose-500 text-white shadow-pixel hover:-translate-x-[2px] hover:-translate-y-[2px] dark:border-rose-100",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
