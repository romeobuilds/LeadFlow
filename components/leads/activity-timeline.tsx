import {
  ArrowRightIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  type LucideIcon,
} from "lucide-react";
import { timeAgo } from "@/lib/format-date";
import type { Activity, ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACTIVITY_META: Record<ActivityType, { icon: LucideIcon; dot: string }> = {
  created: { icon: PlusIcon, dot: "bg-sky-500" },
  stage_changed: { icon: ArrowRightIcon, dot: "bg-violet-500" },
  note_added: { icon: FileTextIcon, dot: "bg-amber-500" },
  updated: { icon: PencilIcon, dot: "bg-slate-400" },
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No activity yet. Changes to this lead will show up here.
      </p>
    );
  }

  return (
    <ol className="grid gap-4">
      {activities.map((activity) => {
        const meta = ACTIVITY_META[activity.type];
        const Icon = meta.icon;
        return (
          <li key={activity.id} className="flex gap-3">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-white",
                meta.dot,
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm">{activity.description ?? activity.type}</p>
              <p className="text-xs text-muted-foreground">
                {timeAgo(activity.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
