"use client";
import { useSession } from "next-auth/react";
import type { Role } from "@/types";
import type { ReactNode } from "react";

export function RoleGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  // While the session is loading, render nothing (avoid flash of hidden content)
  if (status === "loading") return null;
  if (!session?.user || !roles.includes(session.user.role)) return null;
  return <>{children}</>;
}
