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
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/pipeline", label: "Pipeline", icon: KanbanIcon },
  { href: "/leads", label: "Leads", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-card p-4 md:flex">
      <Link href="/" className="flex items-center gap-2 px-2 font-semibold">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <KanbanSquareIcon className="size-4" />
        </span>
        LeadFlow
      </Link>

      <nav className="grid gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
