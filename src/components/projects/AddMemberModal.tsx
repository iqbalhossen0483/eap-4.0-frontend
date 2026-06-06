"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "@/store/api/usersApi";
import { useAddMemberMutation } from "@/store/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { Search } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingMemberIds: string[];
}

export function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  existingMemberIds,
}: Props) {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const { data, isFetching } = useGetUsersQuery(
    { search: debounced || undefined, page_size: 20 },
    { skip: !isOpen },
  );
  const [addMember, { isLoading }] = useAddMemberMutation();

  async function handleAdd(userId: string) {
    try {
      await addMember({ id: projectId, user_id: userId }).unwrap();
      toast.success("Member added");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to add member",
      );
    }
  }

  const candidates = (data?.items ?? []).filter(
    (u) => !existingMemberIds.includes(u.id),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Member">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full rounded-(--radius-btn) border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <div className="max-h-72 space-y-1 overflow-y-auto">
        {isFetching ? (
          <Typography variant="muted" className="py-4 text-center">
            Searching...
          </Typography>
        ) : candidates.length === 0 ? (
          <Typography variant="muted" className="py-4 text-center">
            No users available to add.
          </Typography>
        ) : (
          candidates.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Avatar name={u.name} src={u.avatar_url} size="sm" />
                <div className="min-w-0">
                  <Typography variant="small" className="truncate font-medium">
                    {u.name}
                  </Typography>
                  <Typography variant="caption" className="block truncate">
                    {u.email}
                  </Typography>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                disabled={isLoading}
                onClick={() => handleAdd(u.id)}
              >
                Add
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
