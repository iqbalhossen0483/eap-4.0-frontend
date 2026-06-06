"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  Bell,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";
import { Avatar } from "@/components/ui/Avatar";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setSidebarOpen } from "@/store/uiSlice";
import { useGetUnreadCountQuery } from "@/store/api/notificationsApi";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/activity", label: "Activity", icon: Activity },
];

const secondaryNav: NavItem[] = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/search", label: "Search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const { data: unread } = useGetUnreadCountQuery();

  function NavLink({ item }: { item: NavItem }) {
    const active =
      pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;
    const showBadge = item.href === "/notifications" && (unread?.count ?? 0) > 0;
    return (
      <Link
        href={item.href}
        onClick={() => dispatch(setSidebarOpen(false))}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1">{item.label}</span>
        {showBadge && (
          <span className="rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
            {unread!.count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            E
          </div>
          <Typography variant="h5" className="font-bold">
            EAP
          </Typography>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <Link
            href="/settings"
            onClick={() => dispatch(setSidebarOpen(false))}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Avatar
              name={session?.user?.name ?? "User"}
              src={session?.user?.image}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="truncate font-medium">
                {session?.user?.name ?? "User"}
              </Typography>
              <Typography variant="caption" className="block truncate">
                {session?.user?.email}
              </Typography>
            </div>
            <Settings className="h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
