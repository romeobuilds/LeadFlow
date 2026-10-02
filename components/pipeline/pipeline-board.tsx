"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { InboxIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { PriorityBadge } from "@/components/leads/lead-badges";
import { STAGE_META, formatLeadValue } from "@/lib/stage-meta";
import { moveLeadStage } from "@/app/(dashboard)/leads/actions";
import type { Lead, LeadStage } from "@/lib/types";
import { cn } from "@/lib/utils";

function LeadCard({ lead, overlay = false }: { lead: Lead; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group touch-none cursor-grab rounded-lg bg-card p-2.5 ring-1 ring-foreground/10 transition-colors hover:ring-foreground/20 active:cursor-grabbing",
        isDragging && "opacity-40",
        overlay && "rotate-2 cursor-grabbing opacity-100 shadow-lg ring-foreground/30",
      )}
    >
      <Link
        href={`/leads/${lead.id}`}
        onPointerDown={(e) => e.stopPropagation()}
        className="block truncate text-sm font-medium underline-offset-4 hover:underline"
      >
        {lead.name}
      </Link>
      {lead.company && (
        <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium tabular-nums">
          {formatLeadValue(lead.value)}
        </span>
        <PriorityBadge priority={lead.priority} />
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  leads,
}: {
  stage: (typeof STAGE_META)[number];
  leads: Lead[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value });
  const total = leads.reduce((sum, l) => sum + Number(l.value), 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 snap-start flex-col rounded-lg bg-muted/40 ring-1 ring-foreground/5 transition-colors",
        isOver && "bg-muted ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pt-2.5 pb-1.5">
        <p className="flex items-center gap-1.5 text-xs font-medium">
          <span className={cn("size-1.5 shrink-0 rounded-full", stage.dot)} />
          {stage.label}
          <span className="text-muted-foreground tabular-nums">{leads.length}</span>
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatLeadValue(total)}
        </p>
      </div>
      <div className="flex min-h-28 flex-col gap-1.5 p-1.5 pt-0">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <p
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border border-dashed border-foreground/15 p-3 text-center text-xs text-muted-foreground transition-colors",
              isOver && "border-primary/60 text-foreground",
            )}
          >
            Drop leads here
          </p>
        )}
      </div>
    </div>
  );
}

export function PipelineBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const grouped = useMemo(() => {
    const map = new Map<LeadStage, Lead[]>(
      STAGE_META.map((s) => [s.value, []]),
    );
    for (const lead of leads) map.get(lead.stage)?.push(lead);
    return map;
  }, [leads]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = String(active.id);
    const newStage = over.id as LeadStage;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    const previous = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)),
    );

    startTransition(async () => {
      const result = await moveLeadStage(leadId, newStage);
      if (result?.error) {
        setLeads(previous);
        toast.error(result.error);
      }
    });
  }

  if (leads.length === 0) {
    return (
      <Card size="sm" className="max-w-sm">
        <CardContent className="p-0">
          <EmptyState
            icon={InboxIcon}
            title="Your pipeline is empty"
            description="Create your first lead to start dragging it through the stages."
            action={<LeadDialog />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
        {STAGE_META.map((stage) => (
          <StageColumn
            key={stage.value}
            stage={stage}
            leads={grouped.get(stage.value) ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
