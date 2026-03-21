import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

export const StatCard = ({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) => (
  <Card className="rounded-3xl">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
      </div>
      <div className="rounded-2xl bg-teal-50 p-3 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);
