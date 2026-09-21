"use client";

import { useMemo, useState, useTransition } from "react";
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
        "touch-none rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow",
        isDragging && "opacity-40",
        overlay && "rotate-2 opacity-100 shadow-lg",
      )}
    >
      <p className="truncate text-sm font-medium">{lead.name}</p>
      {lead.company && (
        <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold">{formatLeadValue(lead.value)}</span>
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
        "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/50 transition-colors",
        isOver && "border-primary bg-muted",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className={cn("size-2 rounded-full", stage.dot)} />
          {stage.label}
          <span className="text-xs font-normal text-muted-foreground">
            {leads.length}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{formatLeadValue(total)}</p>
      </div>
      <div className="flex min-h-24 flex-col gap-2 overflow-y-auto p-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <p className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
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
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-2 px-6 py-12 text-center">
          <InboxIcon className="size-8 text-muted-foreground" />
          <p className="font-medium">Your pipeline is empty</p>
          <p className="text-sm text-muted-foreground">
            Create your first lead to start dragging it through the stages.
          </p>
          <LeadDialog />
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
      <div className="flex gap-4 overflow-x-auto pb-4">
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
