import { redirect } from "next/navigation";

// Standalone members view is consolidated into the project detail "Members" tab.
export default async function ProjectMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/projects/${id}`);
}
