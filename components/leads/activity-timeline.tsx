import Link from "next/link";
import {
  ArrowRightIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  type LucideIcon,
} from "lucide-react";
import { timeAgo } from "@/lib/format-date";
import type { Activity, ActivityType } from "@/lib/types";

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  created: PlusIcon,
  stage_changed: ArrowRightIcon,
  note_added: FileTextIcon,
  updated: PencilIcon,
};

const FALLBACK_ICON = PencilIcon;

interface ActivityTimelineProps {
  activities: Activity[];
  /** Optional activity id → lead name, rendered as a link under the description. */
  leadNames?: Record<string, string>;
}

export function ActivityTimeline({
  activities,
  leadNames,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No activity yet. Changes to this lead will show up here.
      </p>
    );
  }

  return (
    <ol className="grid gap-3">
      {activities.map((activity, index) => {
        const Icon = ACTIVITY_ICONS[activity.type] ?? FALLBACK_ICON;
        const leadName = leadNames?.[activity.id];
        const isLast = index === activities.length - 1;

        return (
          <li key={activity.id} className="relative flex gap-2.5">
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-6 bottom-[-0.75rem] left-[0.65625rem] w-px bg-border"
              />
            )}
            <span className="relative mt-px flex size-5 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <Icon className="size-3" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="leading-5">{activity.description ?? activity.type}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                {leadName && (
                  <>
                    <Link
                      href={`/leads/${activity.lead_id}`}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {leadName}
                    </Link>
                    <span aria-hidden>&middot;</span>
                  </>
                )}
                <time dateTime={activity.created_at}>
                  {timeAgo(activity.created_at)}
                </time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
