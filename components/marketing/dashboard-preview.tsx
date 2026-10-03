import type { LucideIcon } from "lucide-react";
import { MessageSquareIcon, MoveRightIcon, PlusIcon } from "lucide-react";
import { MetricStrip, type Metric } from "@/components/dashboard/metric-strip";
import { STAGE_META, formatLeadValue } from "@/lib/stage-meta";
import { cn } from "@/lib/utils";

const METRICS: Metric[] = [
  {
    label: "Open pipeline value",
    value: "$212,400",
    hint: "Excludes won and lost",
  },
  { label: "Total leads", value: "128", hint: "9 new in the last 7 days" },
  { label: "Win rate", value: "62%", hint: "Won ÷ closed" },
  { label: "New this week", value: "9", hint: "Created in the last 7 days" },
];

const STAGE_TOTALS = [
  { stage: "new", count: 38, value: 38400 },
  { stage: "contacted", count: 31, value: 112000 },
  { stage: "qualified", count: 24, value: 86500 },
  { stage: "proposal", count: 14, value: 64000 },
  { stage: "won", count: 13, value: 52300 },
  { stage: "lost", count: 8, value: 21700 },
] as const;

const ACTIVITY: { icon: LucideIcon; lead: string; detail: string; time: string }[] =
  [
    {
      icon: MoveRightIcon,
      lead: "Marcus Chen",
      detail: "moved to Contacted",
      time: "2h ago",
    },
    {
      icon: MessageSquareIcon,
      lead: "Priya Nair",
      detail: "note added — pricing for 3 locations",
      time: "5h ago",
    },
    {
      icon: MoveRightIcon,
      lead: "James Okafor",
      detail: "moved to Proposal",
      time: "Yesterday",
    },
    {
      icon: PlusIcon,
      lead: "Ava Thompson",
      detail: "created from Website",
      time: "2d ago",
    },
  ];

export function DashboardPreview() {
  const maxCount = Math.max(...STAGE_TOTALS.map((s) => s.count));

  return (
    <section id="dashboard" className="scroll-mt-20 border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-3">
          <h2 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-balance">
            Know exactly where your pipeline stands.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Every metric is derived from the leads you actually entered — open
            pipeline value, win rate, and where the last 30 days of new leads landed.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid content-start gap-5 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <MetricStrip metrics={METRICS} />
            <div className="grid gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Value by stage
                </h3>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatLeadValue(
                    STAGE_TOTALS.reduce((sum, s) => sum + s.value, 0),
                  )}{" "}
                  total
                </p>
              </div>
              {STAGE_TOTALS.map((bucket) => {
                const meta = STAGE_META.find((s) => s.value === bucket.stage);
                return (
                  <div key={bucket.stage} className="grid gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-sm">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            meta?.dot ?? "bg-muted-foreground",
                          )}
                        />
                        {meta?.label ?? bucket.stage}
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {bucket.count}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {formatLeadValue(bucket.value)}
                      </p>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((bucket.count / maxCount) * 100)}%`,
                          backgroundColor: meta?.color ?? "var(--muted-foreground)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid content-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Recent activity
            </h3>
            <ul className="grid gap-3">
              {ACTIVITY.map((item) => (
                <li key={item.lead} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <item.icon className="size-3 text-muted-foreground" />
                  </span>
                  <p className="grid gap-0.5">
                    <span className="text-sm">
                      <span className="font-medium">{item.lead}</span>{" "}
                      <span className="text-muted-foreground">{item.detail}</span>
                    </span>
                    <span className="text-xs text-muted-foreground/80">
                      {item.time}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}