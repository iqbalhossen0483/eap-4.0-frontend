"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useAppSelector } from "@/hooks/redux";
import { humanize } from "@/lib/utils";
import type {
  TasksByPriority,
  TaskStatusDistribution,
  TeamProductivity,
  ProjectSummary,
} from "@/types";

// Hook bundling theme-aware palettes + axis/grid colors used by every chart.
function useChartTheme() {
  const theme = useAppSelector((s) => s.theme.theme);
  const dark = theme === "dark";
  return {
    dark,
    axis: dark ? "#9ca3af" : "#6b7280",
    grid: dark ? "#374151" : "#e5e7eb",
    priority: dark
      ? { high: "#f87171", medium: "#fbbf24", low: "#4ade80" }
      : { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" },
    status: dark
      ? { todo: "#94a3b8", in_progress: "#60a5fa", completed: "#4ade80" }
      : { todo: "#cbd5e1", in_progress: "#3b82f6", completed: "#22c55e" },
    primary: dark ? "#818cf8" : "#4f46e5",
    completed: dark ? "#4ade80" : "#22c55e",
    pending: dark ? "#fbbf24" : "#f59e0b",
  };
}

const tooltipStyle = (dark: boolean) => ({
  backgroundColor: dark ? "#1f2937" : "#ffffff",
  border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
  borderRadius: 8,
  color: dark ? "#f3f4f6" : "#111827",
});

export function PriorityBarChart({ data }: { data: TasksByPriority[] }) {
  const t = useChartTheme();
  const chartData = data.map((d) => ({ ...d, label: humanize(d.priority) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: t.axis, fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: t.axis, fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle(t.dark)} cursor={{ opacity: 0.1 }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((d) => (
            <Cell
              key={d.priority}
              fill={t.priority[d.priority as keyof typeof t.priority]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }: { data: TaskStatusDistribution[] }) {
  const t = useChartTheme();
  const chartData = data.map((d) => ({ ...d, label: humanize(d.status) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          {chartData.map((d) => (
            <Cell
              key={d.status}
              fill={t.status[d.status as keyof typeof t.status]}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle(t.dark)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TeamProductivityChart({ data }: { data: TeamProductivity[] }) {
  const t = useChartTheme();
  const chartData = data.map((d) => ({
    name: d.user.name,
    completed: d.completed,
    pending: d.pending,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: t.axis, fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: t.axis, fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle(t.dark)} cursor={{ opacity: 0.1 }} />
        <Legend />
        <Bar dataKey="completed" stackId="a" fill={t.completed} radius={[0, 0, 0, 0]} />
        <Bar dataKey="pending" stackId="a" fill={t.pending} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectProgressChart({ data }: { data: ProjectSummary[] }) {
  const t = useChartTheme();
  const chartData = data.map((d) => ({
    name: d.name,
    percent: d.completion_percent,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
        <XAxis dataKey="name" tick={{ fill: t.axis, fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fill: t.axis, fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle(t.dark)} />
        <Line
          type="monotone"
          dataKey="percent"
          stroke={t.primary}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
