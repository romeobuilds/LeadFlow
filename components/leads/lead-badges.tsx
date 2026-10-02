import { STAGE_META } from "@/lib/stage-meta";
import type { LeadPriority, LeadStage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StageBadge({ stage }: { stage: LeadStage }) {
  const meta = STAGE_META.find((s) => s.value === stage);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
      <span
        className={cn("size-1.5 shrink-0 rounded-full", meta?.dot ?? "bg-muted-foreground")}
      />
      {meta?.label ?? stage}
    </span>
  );
}

const PRIORITY_STYLES: Record<LeadPriority, string> = {
  high: "bg-destructive",
  medium: "bg-amber-500/70",
  low: "bg-muted-foreground/40",
};

const PRIORITY_TEXT: Record<LeadPriority, string> = {
  high: "text-destructive",
  medium: "text-muted-foreground",
  low: "text-muted-foreground",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: LeadPriority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs whitespace-nowrap",
        PRIORITY_TEXT[priority],
        className,
      )}
    >
      <span className={cn("size-1 shrink-0 rounded-full", PRIORITY_STYLES[priority])} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
