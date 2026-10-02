import { HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import type { Activity } from "@/lib/types";

export interface RecentActivity extends Activity {
  lead_name: string;
  lead_id: string;
}

export function RecentActivityCard({
  activities,
}: {
  activities: RecentActivity[];
}) {
  const leadNames = Object.fromEntries(
    activities.map((a) => [a.id, a.lead_name]),
  );

  return (
    <section className="grid content-start gap-3">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Recent activity
      </h2>
      <div className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
        {activities.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No activity yet"
            description="Add a lead and its history will show up here."
          />
        ) : (
          <ActivityTimeline activities={activities} leadNames={leadNames} />
        )}
      </div>
    </section>
  );
}
