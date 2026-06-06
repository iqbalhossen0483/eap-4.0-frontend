"use client";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useUpdateTaskStatusMutation } from "@/store/api/tasksApi";
import { humanize } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

const options: TaskStatus[] = ["todo", "in_progress", "completed"];

export function StatusDropdown({ task }: { task: Task }) {
  const [updateStatus] = useUpdateTaskStatusMutation();

  async function change(status: TaskStatus) {
    if (status === task.status) return;
    try {
      await updateStatus({ id: task.id, status }).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to update status",
      );
    }
  }

  return (
    <Dropdown
      trigger={
        <button className="cursor-pointer" aria-label="Change status">
          <Badge variant={task.status}>{humanize(task.status)}</Badge>
        </button>
      }
    >
      {options.map((s) => (
        <DropdownItem key={s} onClick={() => change(s)}>
          <Badge variant={s}>{humanize(s)}</Badge>
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
