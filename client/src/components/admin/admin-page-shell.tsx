import { ReactNode } from "react";

export const AdminPageShell = ({
  title,
  description,
  actions,
  children
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <section className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {actions}
    </div>
    {children}
  </section>
);
