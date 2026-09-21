export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_PRIORITIES = ["low", "medium", "high"] as const;

export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  value: number;
  stage: LeadStage;
  source: string | null;
  priority: LeadPriority;
  expected_close: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export type ActivityType =
  | "created"
  | "stage_changed"
  | "note_added"
  | "updated";

export interface Activity {
  id: string;
  lead_id: string;
  user_id: string;
  type: ActivityType;
  description: string | null;
  created_at: string;
}
