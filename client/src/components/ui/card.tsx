import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "pixel-surface pixel-grid-overlay rounded-[1.25rem] p-6 backdrop-blur",
      className
    )}
    {...props}
  />
);
