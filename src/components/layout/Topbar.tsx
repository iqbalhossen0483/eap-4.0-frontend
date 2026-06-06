"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, Sun, Moon, Bell, LogOut, User as UserIcon } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleSidebar } from "@/store/uiSlice";
import { toggleTheme } from "@/store/themeSlice";
import { useGetUnreadCountQuery } from "@/store/api/notificationsApi";

// Derive a readable page title from the first path segment.
function titleFromPath(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);
  const { data: session } = useSession();
  const { data: unread } = useGetUnreadCountQuery();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Typography variant="h4">{titleFromPath(pathname)}</Typography>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {(unread?.count ?? 0) > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unread!.count > 9 ? "9+" : unread!.count}
            </span>
          )}
        </Link>

        <Dropdown
          trigger={
            <button className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Avatar
                name={session?.user?.name ?? "User"}
                src={session?.user?.image}
                size="sm"
              />
            </button>
          }
        >
          <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
            <Typography variant="small" className="font-medium">
              {session?.user?.name}
            </Typography>
            <Typography variant="caption" className="block truncate">
              {session?.user?.email}
            </Typography>
          </div>
          <DropdownItem onClick={() => router.push("/settings")}>
            <UserIcon className="h-4 w-4" /> Profile & Settings
          </DropdownItem>
          <DropdownItem danger onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" /> Logout
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
