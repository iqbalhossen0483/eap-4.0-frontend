"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, SearchX, FolderKanban, CheckSquare } from "lucide-react";
import { useSearchQuery } from "@/store/api/searchApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { humanize } from "@/lib/utils";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);
  const { data, isFetching } = useSearchQuery(debounced, {
    skip: debounced.trim().length === 0,
  });

  const hasQuery = debounced.trim().length > 0;
  const hasResults =
    data &&
    (data.projects.length > 0 || data.tasks.length > 0 || data.users.length > 0);

  return (
    <div className="space-y-5">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, tasks, and people..."
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
        />
        {isFetching && (
          <Spinner className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}
      </div>

      {!hasQuery ? (
        <EmptyState
          icon={<SearchIcon className="h-10 w-10" />}
          title="Search everything"
          subtitle="Start typing to find projects, tasks, and team members."
        />
      ) : !isFetching && !hasResults ? (
        <EmptyState
          icon={<SearchX className="h-10 w-10" />}
          title={`No results for "${debounced}"`}
        />
      ) : (
        <div className="space-y-4">
          {data && data.projects.length > 0 && (
            <Card variant="default" padding="md">
              <Card.Header>
                <Typography variant="h5">Projects</Typography>
              </Card.Header>
              <Card.Body className="space-y-1">
                {data.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/projects/${p.id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-gray-400" />
                      <Typography variant="small">{p.name}</Typography>
                    </span>
                    <Badge variant={p.status}>{humanize(p.status)}</Badge>
                  </button>
                ))}
              </Card.Body>
            </Card>
          )}

          {data && data.tasks.length > 0 && (
            <Card variant="default" padding="md">
              <Card.Header>
                <Typography variant="h5">Tasks</Typography>
              </Card.Header>
              <Card.Body className="space-y-1">
                {data.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/projects/${t.project_id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      <Typography variant="small">{t.title}</Typography>
                    </span>
                    <Badge variant={t.status}>{humanize(t.status)}</Badge>
                  </button>
                ))}
              </Card.Body>
            </Card>
          )}

          {data && data.users.length > 0 && (
            <Card variant="default" padding="md">
              <Card.Header>
                <Typography variant="h5">Team Members</Typography>
              </Card.Header>
              <Card.Body className="space-y-1">
                {data.users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-2"
                  >
                    <Avatar name={u.name} src={u.avatar_url} size="sm" />
                    <div>
                      <Typography variant="small" className="font-medium">
                        {u.name}
                      </Typography>
                      <Typography variant="caption" className="block">
                        {u.email}
                      </Typography>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
