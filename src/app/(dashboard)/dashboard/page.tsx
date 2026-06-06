"use client";
import Link from "next/link";
import { Activity as ActivityIcon, CalendarClock, Flame } from "lucide-react";
import { useGetDashboardQuery } from "@/store/api/dashboardApi";
import { useGetActivityQuery } from "@/store/api/activityApi";
import { KpiCards } from "@/components/dashboard/KpiCards";
import {
  PriorityBarChart,
  StatusPieChart,
  TeamProductivityChart,
  ProjectProgressChart,
} from "@/components/dashboard/charts";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDate, formatDateTime, humanize, deadlineProximity } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardQuery();
  const { data: activity } = useGetActivityQuery({ limit: 8 });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KpiCards kpi={data.kpi} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Tasks by Priority</Typography>
          </Card.Header>
          <Card.Body>
            {data.tasks_by_priority.length ? (
              <PriorityBarChart data={data.tasks_by_priority} />
            ) : (
              <EmptyState title="No task data yet" />
            )}
          </Card.Body>
        </Card>

        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Task Status Distribution</Typography>
          </Card.Header>
          <Card.Body>
            {data.task_status_distribution.length ? (
              <StatusPieChart data={data.task_status_distribution} />
            ) : (
              <EmptyState title="No task data yet" />
            )}
          </Card.Body>
        </Card>

        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Team Productivity</Typography>
          </Card.Header>
          <Card.Body>
            {data.team_productivity.length ? (
              <TeamProductivityChart data={data.team_productivity} />
            ) : (
              <EmptyState title="No team data yet" />
            )}
          </Card.Body>
        </Card>

        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Project Progress</Typography>
          </Card.Header>
          <Card.Body>
            {data.project_summaries.length ? (
              <ProjectProgressChart data={data.project_summaries} />
            ) : (
              <EmptyState title="No projects yet" />
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Lower panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Project summaries */}
        <Card variant="default" padding="md" className="lg:col-span-2">
          <Card.Header>
            <Typography variant="h4">Project Summaries</Typography>
          </Card.Header>
          <Card.Body className="space-y-3">
            {data.project_summaries.length ? (
              data.project_summaries.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="block rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Typography variant="small" className="font-medium">
                      {p.name}
                    </Typography>
                    <Badge variant={p.status}>{humanize(p.status)}</Badge>
                  </div>
                  <ProgressBar value={p.completion_percent} />
                  <div className="mt-1.5 flex justify-between">
                    <Typography variant="caption">
                      {p.completed_count}/{p.task_count} tasks
                    </Typography>
                    <Typography variant="caption">
                      {p.completion_percent}% • due {formatDate(p.deadline)}
                    </Typography>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState title="No projects yet" />
            )}
          </Card.Body>
        </Card>

        {/* Recent activity */}
        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Recent Activity</Typography>
          </Card.Header>
          <Card.Body className="space-y-3">
            {activity?.items?.length ? (
              activity.items.map((a) => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <Avatar name={a.actor.name} src={a.actor.avatar_url} size="sm" />
                  <div className="min-w-0">
                    <Typography variant="small">
                      <span className="font-medium">{a.actor.name}</span>{" "}
                      {humanize(a.action).toLowerCase()}
                    </Typography>
                    <Typography variant="caption" className="block">
                      {formatDateTime(a.created_at)}
                    </Typography>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<ActivityIcon className="h-8 w-8" />}
                title="No recent activity"
              />
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Deadlines + high priority */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">Upcoming Deadlines</Typography>
          </Card.Header>
          <Card.Body className="space-y-2">
            {data.upcoming_deadlines.length ? (
              data.upcoming_deadlines.map((d) => {
                const prox = deadlineProximity(d.due_date);
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-1 py-1.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarClock className="h-4 w-4 shrink-0 text-gray-400" />
                      <Typography variant="small" className="truncate">
                        {d.title}
                      </Typography>
                    </div>
                    <Badge
                      variant={
                        prox === "overdue" || prox === "today"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {formatDate(d.due_date)}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No upcoming deadlines" />
            )}
          </Card.Body>
        </Card>

        <Card variant="default" padding="md">
          <Card.Header>
            <Typography variant="h4">High Priority Tasks</Typography>
          </Card.Header>
          <Card.Body className="space-y-2">
            {data.high_priority_tasks.length ? (
              data.high_priority_tasks.map((t) => (
                <Link
                  key={t.id}
                  href={`/projects/${t.project_id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Flame className="h-4 w-4 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <Typography variant="small" className="truncate">
                        {t.title}
                      </Typography>
                      <Typography variant="caption" className="block truncate">
                        {t.project_name}
                      </Typography>
                    </div>
                  </div>
                  <Badge variant={t.status}>{humanize(t.status)}</Badge>
                </Link>
              ))
            ) : (
              <EmptyState title="No high priority tasks" />
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
