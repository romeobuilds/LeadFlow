import type { LeadStage } from "@/lib/types";

export interface StageMeta {
  value: LeadStage;
  label: string;
  /** Tailwind classes for the column dot / badge accent. */
  dot: string;
  /** Hex color for charts. */
  color: string;
  /** Muted styling for closed columns. */
  closed?: boolean;
}

export const STAGE_META: StageMeta[] = [
  { value: "new", label: "New", dot: "bg-sky-500", color: "#0ea5e9" },
  { value: "contacted", label: "Contacted", dot: "bg-amber-500", color: "#f59e0b" },
  { value: "qualified", label: "Qualified", dot: "bg-violet-500", color: "#8b5cf6" },
  { value: "proposal", label: "Proposal", dot: "bg-orange-500", color: "#f97316" },
  { value: "won", label: "Won", dot: "bg-emerald-500", color: "#10b981", closed: true },
  { value: "lost", label: "Lost", dot: "bg-rose-500", color: "#f43f5e", closed: true },
];

export function formatLeadValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
