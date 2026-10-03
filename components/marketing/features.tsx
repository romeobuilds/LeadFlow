import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesColumnIncreasingIcon,
  CircleDollarSignIcon,
  HistoryIcon,
  KanbanIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: KanbanIcon,
    title: "Drag-and-drop pipeline",
    description:
      "Six stages from new to won or lost. Move a deal forward with one drag and the totals for every column update instantly.",
  },
  {
    icon: UsersIcon,
    title: "A lead list that stays sortable",
    description:
      "Search by name, company, or email and filter by stage, priority, or source. Every row carries value, owner, and expected close date.",
  },
  {
    icon: ChartNoAxesColumnIncreasingIcon,
    title: "Numbers you can trust",
    description:
      "Open pipeline value, win rate, leads created this week, and a 30-day trend — all computed from your own leads, never a sample.",
  },
  {
    icon: CircleDollarSignIcon,
    title: "Deal values and priorities",
    description:
      "Put a number on every opportunity and flag it high, medium, or low so the work that pays gets done first.",
  },
  {
    icon: HistoryIcon,
    title: "A history for every lead",
    description:
      "Stage changes, edits, and notes are logged to a per-lead timeline, so any follow-up starts with the full context.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by default",
    description:
      "Your leads are scoped to your account with row-level security. No shared team inbox, no one else's pipeline in your metrics.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-3">
          <h2 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-balance">
            Everything between &ldquo;I got an inquiry&rdquo; and &ldquo;deal
            signed&rdquo;.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            LeadFlow covers the whole lead lifecycle instead of one slice of it, so
            nothing falls through the cracks between your inbox and your calendar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="grid content-start gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <feature.icon className="size-4" />
              </span>
              <h3 className="font-heading text-base font-medium tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}