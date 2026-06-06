import {
  BarChart2,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { KPIStats } from "@/types";

interface KpiDef {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
}

export function KpiCards({ kpi }: { kpi: KPIStats }) {
  const cards: KpiDef[] = [
    {
      label: "Total Projects",
      value: kpi.total_projects,
      icon: BarChart2,
      accent: "text-primary-600 bg-primary-50 dark:bg-primary-900/30",
    },
    {
      label: "Total Tasks",
      value: kpi.total_tasks,
      icon: ListTodo,
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
    },
    {
      label: "Completed",
      value: kpi.completed_tasks,
      icon: CheckCircle2,
      accent: "text-green-600 bg-green-50 dark:bg-green-900/30",
    },
    {
      label: "Pending",
      value: kpi.pending_tasks,
      icon: Clock,
      accent: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
    },
    {
      label: "Overdue",
      value: kpi.overdue_tasks,
      icon: AlertTriangle,
      accent: "text-red-600 bg-red-50 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div className={cn("rounded-lg p-2", c.accent)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <Typography variant="h2" className="mt-3">
              {c.value}
            </Typography>
            <Typography variant="muted">{c.label}</Typography>
          </Card>
        );
      })}
    </div>
  );
}
