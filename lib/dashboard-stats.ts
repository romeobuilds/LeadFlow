import { STAGE_META } from "@/lib/stage-meta";
import type { LeadStage } from "@/lib/types";

export interface DashboardLead {
  stage: LeadStage;
  value: number;
  created_at: string;
}

export interface StageBucket {
  stage: LeadStage;
  label: string;
  color: string;
  count: number;
  value: number;
}

export interface TrendPoint {
  date: string;
  label: string;
  count: number;
}

export interface DashboardStats {
  total: number;
  openValue: number;
  winRate: number | null;
  newThisWeek: number;
  stages: StageBucket[];
  trend: TrendPoint[];
}

const DAY_MS = 86_400_000;

export function computeDashboardStats(
  leads: DashboardLead[],
  now: number = Date.now(),
): DashboardStats {
  const stages: StageBucket[] = STAGE_META.map((s) => ({
    stage: s.value,
    label: s.label,
    color: s.color,
    count: 0,
    value: 0,
  }));
  const byStage = new Map<LeadStage, StageBucket>(
    stages.map((s) => [s.stage, s]),
  );

  let openValue = 0;
  let newThisWeek = 0;

  for (const lead of leads) {
    const bucket = byStage.get(lead.stage);
    if (bucket) {
      bucket.count += 1;
      bucket.value += Number(lead.value) || 0;
    }
    if (lead.stage !== "won" && lead.stage !== "lost") {
      openValue += Number(lead.value) || 0;
    }
    if (now - new Date(lead.created_at).getTime() <= 7 * DAY_MS) {
      newThisWeek += 1;
    }
  }

  const won = byStage.get("won")?.count ?? 0;
  const lost = byStage.get("lost")?.count ?? 0;
  const closed = won + lost;

  // Last 30 days, oldest → newest, zero-filled.
  const trend: TrendPoint[] = [];
  const dayBuckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    dayBuckets.set(key, 0);
    trend.push({
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 0,
    });
  }
  for (const lead of leads) {
    const key = new Date(lead.created_at).toISOString().slice(0, 10);
    if (dayBuckets.has(key)) dayBuckets.set(key, dayBuckets.get(key)! + 1);
  }
  for (const point of trend) point.count = dayBuckets.get(point.date) ?? 0;

  return {
    total: leads.length,
    openValue,
    winRate: closed > 0 ? Math.round((won / closed) * 100) : null,
    newThisWeek,
    stages,
    trend,
  };
}
