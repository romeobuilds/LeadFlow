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
  { value: "new", label: "New", dot: "bg-blue-400", color: "#60a5fa" },
  { value: "contacted", label: "Contacted", dot: "bg-blue-500", color: "#3b82f6" },
  { value: "qualified", label: "Qualified", dot: "bg-blue-600", color: "#2563eb" },
  { value: "proposal", label: "Proposal", dot: "bg-blue-800", color: "#1e40af" },
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
