import {
  GripVerticalIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react";
import { PriorityBadge } from "@/components/leads/lead-badges";
import { STAGE_META, formatLeadValue } from "@/lib/stage-meta";
import type { LeadPriority, LeadStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PreviewLead {
  name: string;
  company: string;
  value: number;
  priority: LeadPriority;
  stage: LeadStage;
  dragging?: boolean;
}

const PREVIEW_LEADS: PreviewLead[] = [
  {
    name: "Ava Thompson",
    company: "Brightleaf Studio",
    value: 4500,
    priority: "high",
    stage: "new",
  },
  {
    name: "Tom Baker",
    company: "Baker Plumbing",
    value: 1900,
    priority: "low",
    stage: "new",
  },
  {
    name: "Marcus Chen",
    company: "Northwind Traders",
    value: 12000,
    priority: "high",
    stage: "contacted",
  },
  {
    name: "Priya Nair",
    company: "Nair Consulting",
    value: 5400,
    priority: "medium",
    stage: "contacted",
  },
  {
    name: "Sofia Reyes",
    company: "Café Colibrí",
    value: 2800,
    priority: "medium",
    stage: "qualified",
    dragging: true,
  },
  {
    name: "James Okafor",
    company: "Okafor Legal",
    value: 8500,
    priority: "high",
    stage: "proposal",
  },
];

const RAIL_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboardIcon, active: false },
  { label: "Pipeline", icon: KanbanIcon, active: true },
  { label: "Leads", icon: UsersIcon, active: false },
];

const OPEN_STAGES = STAGE_META.filter((stage) => !stage.closed);

function LeadPreviewCard({ lead }: { lead: PreviewLead }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-2.5 ring-1 ring-foreground/10",
        lead.dragging &&
          "relative z-10 rotate-2 shadow-lg ring-foreground/30 select-none",
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVerticalIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground/50" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{lead.name}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 pl-5">
        <span className="text-sm font-medium tabular-nums">
          {formatLeadValue(lead.value)}
        </span>
        <PriorityBadge priority={lead.priority} />
      </div>
    </div>
  );
}

export function PipelinePreview() {
  return (
    <div
      id="pipeline"
      role="img"
      aria-label="The LeadFlow pipeline board, with leads in the new, contacted, qualified and proposal stages."
      className="scroll-mt-20 overflow-hidden rounded-xl bg-card shadow-lg ring-1 shadow-foreground/5 ring-foreground/10"
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-destructive/60" />
          <span className="size-2 rounded-full bg-amber-500/60" />
          <span className="size-2 rounded-full bg-emerald-500/60" />
        </span>
        <span className="ml-1 text-xs text-muted-foreground">
          Pipeline · Brightleaf Studio
        </span>
      </div>

      <div className="flex bg-muted/30">
        <div className="hidden w-40 shrink-0 flex-col gap-4 border-r bg-sidebar p-3 sm:flex">
          <div className="flex items-center gap-2 px-1">
            <span className="flex size-5 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
              <KanbanIcon className="size-3" />
            </span>
            <span className="text-xs font-semibold tracking-tight">LeadFlow</span>
          </div>
          <div className="grid gap-0.5">
            {RAIL_ITEMS.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                  item.active
                    ? "bg-foreground/5 font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="size-3.5 shrink-0" />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 p-3">
          <div className="flex snap-x gap-2 overflow-x-auto pb-1">
            {OPEN_STAGES.map((stage) => {
              const leads = PREVIEW_LEADS.filter(
                (lead) => lead.stage === stage.value,
              );
              const total = leads.reduce((sum, lead) => sum + lead.value, 0);
              return (
                <div
                  key={stage.value}
                  className="flex w-52 shrink-0 snap-start flex-col rounded-lg bg-muted/60 p-1.5 ring-1 ring-foreground/5 sm:w-56"
                >
                  <div className="flex items-center justify-between gap-2 px-1 pt-1 pb-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={cn("size-1.5 shrink-0 rounded-full", stage.dot)}
                      />
                      {stage.label}
                      <span className="text-muted-foreground tabular-nums">
                        {leads.length}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatLeadValue(total)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {leads.map((lead) => (
                      <LeadPreviewCard key={lead.name} lead={lead} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}