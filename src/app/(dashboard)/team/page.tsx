"use client";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useGetTeamProductivityQuery } from "@/store/api/dashboardApi";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Table, type ColumnDef } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { humanize } from "@/lib/utils";
import type { TeamProductivity } from "@/types";

export default function TeamPage() {
  const router = useRouter();
  const { data, isLoading } = useGetTeamProductivityQuery();

  const columns: ColumnDef<TeamProductivity>[] = [
    {
      key: "member",
      header: "Member",
      render: (m) => (
        <span className="inline-flex items-center gap-2">
          <Avatar name={m.user.name} src={m.user.avatar_url} size="sm" />
          <span className="font-medium">{m.user.name}</span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (m) => <Badge variant="default">{humanize(m.role)}</Badge>,
    },
    { key: "total", header: "Total", accessor: "total", align: "center" },
    { key: "completed", header: "Completed", accessor: "completed", align: "center" },
    { key: "pending", header: "Pending", accessor: "pending", align: "center" },
    {
      key: "completion",
      header: "Completion %",
      width: "w-48",
      render: (m) => {
        const pct = m.total ? Math.round((m.completed / m.total) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <ProgressBar value={pct} className="flex-1" />
            <span className="w-10 text-right text-sm tabular-nums">{pct}%</span>
          </div>
        );
      },
    },
  ];

  const members = data ?? [];

  return (
    <div className="space-y-5">
      <Typography variant="muted">
        Workload summary across all members on your projects.
      </Typography>

      {!isLoading && members.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No team data yet"
          subtitle="Assign tasks to members to see workload here."
        />
      ) : (
        <Card variant="default" padding="none">
          <Card.Body className="py-0 overflow-x-auto">
            <Table
              data={members}
              columns={columns}
              isLoading={isLoading}
              hoverable
              rowKey={(m) => m.user.id}
              onRowClick={(m) => router.push(`/tasks?assigned_to=${m.user.id}`)}
            />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
