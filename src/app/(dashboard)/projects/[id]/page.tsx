"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Pencil, UserPlus, Trash2, Activity as ActivityIcon } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProjectQuery,
  useGetProjectMembersQuery,
  useRemoveMemberMutation,
} from "@/store/api/projectsApi";
import { useGetActivityQuery } from "@/store/api/activityApi";
import { TaskList } from "@/components/tasks/TaskList";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { AddMemberModal } from "@/components/projects/AddMemberModal";
import { RoleGuard } from "@/components/RoleGuard";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate, formatDateTime, humanize } from "@/lib/utils";

const tabs = [
  { key: "tasks", label: "Tasks" },
  { key: "members", label: "Members" },
  { key: "activity", label: "Activity" },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: project, isLoading } = useGetProjectQuery(id);
  const [tab, setTab] = useState("tasks");
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading || !project) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <Card variant="default" padding="md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Typography variant="h3">{project.name}</Typography>
              <Badge variant={project.status}>{humanize(project.status)}</Badge>
            </div>
            <Typography variant="muted">
              {project.description || "No description"}
            </Typography>
            <Typography variant="caption" className="mt-2 block">
              Owner: {project.owner.name} • Due {formatDate(project.deadline)}
            </Typography>
          </div>
          <RoleGuard roles={["admin", "project_manager"]}>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </RoleGuard>
        </div>
      </Card>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "tasks" && <TaskList projectId={id} />}
      {tab === "members" && <MembersTab projectId={id} />}
      {tab === "activity" && <ProjectActivityTab projectId={id} />}

      <ProjectFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        project={project}
      />
    </div>
  );
}

function MembersTab({ projectId }: { projectId: string }) {
  const { data: members, isLoading } = useGetProjectMembersQuery(projectId);
  const [removeMember] = useRemoveMemberMutation();
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState<{ userId: string; name: string } | null>(
    null,
  );

  async function confirmRemove() {
    if (!removing) return;
    try {
      await removeMember({ id: projectId, userId: removing.userId }).unwrap();
      toast.success("Member removed");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to remove member",
      );
    }
  }

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />;

  return (
    <Card variant="default" padding="md">
      <Card.Header>
        <Typography variant="h4">Members</Typography>
        <RoleGuard roles={["admin", "project_manager"]}>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" /> Add Member
          </Button>
        </RoleGuard>
      </Card.Header>
      <Card.Body className="space-y-1">
        {members?.length ? (
          members.map((m) => (
            <div
              key={m.user_id}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Avatar name={m.user.name} src={m.user.avatar_url} size="sm" />
                <div>
                  <Typography variant="small" className="font-medium">
                    {m.user.name}
                  </Typography>
                  <Typography variant="caption" className="block">
                    Joined {formatDate(m.joined_at)}
                  </Typography>
                </div>
              </div>
              <RoleGuard roles={["admin", "project_manager"]}>
                <button
                  onClick={() =>
                    setRemoving({ userId: m.user_id, name: m.user.name })
                  }
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                  aria-label="Remove member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </RoleGuard>
            </div>
          ))
        ) : (
          <EmptyState title="No members yet" />
        )}
      </Card.Body>

      <AddMemberModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        projectId={projectId}
        existingMemberIds={members?.map((m) => m.user_id) ?? []}
      />
      <ConfirmDialog
        isOpen={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
        title="Remove member"
        message={`Remove ${removing?.name} from this project?`}
        confirmLabel="Remove"
      />
    </Card>
  );
}

function ProjectActivityTab({ projectId }: { projectId: string }) {
  const { data, isLoading } = useGetActivityQuery({ project_id: projectId, limit: 20 });

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />;

  return (
    <Card variant="default" padding="md">
      <Card.Body className="space-y-3">
        {data?.items?.length ? (
          data.items.map((a) => (
            <div key={a.id} className="flex items-start gap-2.5">
              <Avatar name={a.actor.name} src={a.actor.avatar_url} size="sm" />
              <div>
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
            title="No activity yet"
          />
        )}
      </Card.Body>
    </Card>
  );
}
