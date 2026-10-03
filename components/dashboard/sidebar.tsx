"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KanbanSquareIcon,
  LayoutDashboardIcon,
  KanbanIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/pipeline", label: "Pipeline", icon: KanbanIcon },
  { href: "/leads", label: "Leads", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 shrink-0 flex-col gap-6 border-r bg-sidebar p-3 md:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
        <span className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <KanbanSquareIcon className="size-3.5" />
        </span>
        <span className="font-heading text-sm font-semibold tracking-tight">
          LeadFlow
        </span>
      </Link>

      <nav className="grid gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-2.5 rounded-md py-1.5 pr-2 pl-2.5 text-sm transition-colors",
                isActive
                  ? "bg-foreground/5 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-foreground transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
