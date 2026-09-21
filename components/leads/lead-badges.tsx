import { Badge } from "@/components/ui/badge";
import { STAGE_META } from "@/lib/stage-meta";
import type { LeadPriority, LeadStage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StageBadge({ stage }: { stage: LeadStage }) {
  const meta = STAGE_META.find((s) => s.value === stage);
  return (
    <Badge variant="secondary" className="gap-1.5 font-normal">
      <span className={cn("size-1.5 rounded-full", meta?.dot ?? "bg-muted-foreground")} />
      {meta?.label ?? stage}
    </Badge>
  );
}

const PRIORITY_STYLES: Record<LeadPriority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span className={cn("size-1.5 rounded-full", PRIORITY_STYLES[priority])} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
