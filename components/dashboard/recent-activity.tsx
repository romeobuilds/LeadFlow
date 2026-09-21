import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent activity</CardTitle>
        <CardDescription>Latest events across all leads.</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet. Add a lead to get started.
          </p>
        ) : (
          <ol className="grid gap-4">
            {activities.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/leads/${a.lead_id}`}
                  className="mb-1 block text-xs font-medium text-primary hover:underline"
                >
                  {a.lead_name}
                </Link>
                <ActivityTimeline
                  activities={[
                    {
                      id: a.id,
                      lead_id: a.lead_id,
                      user_id: a.user_id,
                      type: a.type,
                      description: a.description,
                      created_at: a.created_at,
                    },
                  ]}
                />
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
