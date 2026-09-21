import type { LeadStage } from "@/lib/types";

export interface StageMeta {
  value: LeadStage;
  label: string;
  /** Tailwind classes for the column dot / badge accent. */
  dot: string;
  /** Muted styling for closed columns. */
  closed?: boolean;
}

export const STAGE_META: StageMeta[] = [
  { value: "new", label: "New", dot: "bg-sky-500" },
  { value: "contacted", label: "Contacted", dot: "bg-amber-500" },
  { value: "qualified", label: "Qualified", dot: "bg-violet-500" },
  { value: "proposal", label: "Proposal", dot: "bg-orange-500" },
  { value: "won", label: "Won", dot: "bg-emerald-500", closed: true },
  { value: "lost", label: "Lost", dot: "bg-rose-500", closed: true },
];

export function formatLeadValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
