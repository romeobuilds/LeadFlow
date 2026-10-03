import { MetricStrip } from "@/components/dashboard/metric-strip";
import { RecentActivityCard, type RecentActivity } from "@/components/dashboard/recent-activity";
import { StageChart } from "@/components/dashboard/stage-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ValueChart } from "@/components/dashboard/value-chart";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { computeDashboardStats } from "@/lib/dashboard-stats";
import { formatLeadValue } from "@/lib/stage-meta";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: leads }, { data: activityRows }] = await Promise.all([
    supabase
      .from("leads")
      .select("stage, value, created_at")
      .eq("user_id", user!.id),
    supabase
      .from("activities")
      .select("id, lead_id, user_id, type, description, created_at, leads (name)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = computeDashboardStats(leads ?? []);

  const recentActivity: RecentActivity[] = (activityRows ?? []).map((row) => {
    const nested = row.leads as unknown as { name: string } | { name: string }[] | null;
    const leadName = Array.isArray(nested)
      ? (nested[0]?.name ?? "Deleted lead")
      : (nested?.name ?? "Deleted lead");
    return {
      id: row.id,
      lead_id: row.lead_id,
      user_id: row.user_id,
      type: row.type,
      description: row.description,
      created_at: row.created_at,
      lead_name: leadName,
    };
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <PageHeader
        title="Dashboard"
        description="Your pipeline at a glance."
        action={<LeadDialog />}
      />

      <MetricStrip
        metrics={[
          {
            label: "Open pipeline value",
            value: formatLeadValue(stats.openValue),
            hint: "Excludes won and lost",
          },
          {
            label: "Total leads",
            value: String(stats.total),
            hint: `${stats.newThisWeek} new in the last 7 days`,
          },
          {
            label: "Win rate",
            value: stats.winRate === null ? "—" : `${stats.winRate}%`,
            hint:
              stats.winRate === null ? "Close your first deal" : "Won ÷ closed",
          },
          {
            label: "New this week",
            value: String(stats.newThisWeek),
            hint: "Created in the last 7 days",
          },
        ]}
      />

      <div className="grid items-start gap-6 md:grid-cols-2">
        <StageChart stages={stats.stages} />
        <TrendChart trend={stats.trend} />
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <ValueChart stages={stats.stages} />
        <RecentActivityCard activities={recentActivity} />
      </div>
    </div>
  );
}
