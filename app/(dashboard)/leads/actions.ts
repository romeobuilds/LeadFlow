"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validations/lead";
import { LEAD_STAGES, type LeadStage } from "@/lib/types";

export interface LeadActionResult {
  error?: string;
}

const REVALIDATE_PATHS = ["/", "/leads", "/pipeline"] as const;

function revalidateLeadPages() {
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
}

async function requireUserId(): Promise<{
  supabase: SupabaseClient;
  userId: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

export async function createLead(
  input: unknown,
): Promise<LeadActionResult | void> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  const { error } = await supabase.from("leads").insert({
    user_id: userId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    value: parsed.data.value,
    stage: parsed.data.stage,
    source: parsed.data.source,
    priority: parsed.data.priority,
    expected_close: parsed.data.expectedClose,
  });

  if (error) return { error: error.message };
  revalidateLeadPages();
}

export async function updateLead(
  id: string,
  input: unknown,
): Promise<LeadActionResult | void> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("leads")
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      value: parsed.data.value,
      stage: parsed.data.stage,
      source: parsed.data.source,
      priority: parsed.data.priority,
      expected_close: parsed.data.expectedClose,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidateLeadPages();
}

export async function deleteLead(id: string): Promise<LeadActionResult | void> {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidateLeadPages();
}

export async function moveLeadStage(
  id: string,
  stage: LeadStage,
): Promise<LeadActionResult | void> {
  if (!LEAD_STAGES.includes(stage)) return { error: "Invalid stage." };

  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("leads")
    .update({ stage })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidateLeadPages();
}

export async function addNote(
  leadId: string,
  content: unknown,
): Promise<LeadActionResult | void> {
  const text = typeof content === "string" ? content.trim() : "";
  if (!text) return { error: "Note can't be empty." };
  if (text.length > 2000) return { error: "Note is too long (max 2000 chars)." };

  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  // Verify ownership before writing (RLS enforces it too).
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("user_id", userId)
    .single();
  if (!lead) return { error: "Lead not found." };

  const { error: noteError } = await supabase.from("notes").insert({
    lead_id: leadId,
    user_id: userId,
    content: text,
  });
  if (noteError) return { error: noteError.message };

  const { error: activityError } = await supabase.from("activities").insert({
    lead_id: leadId,
    user_id: userId,
    type: "note_added",
    description:
      text.length > 80 ? `Note added: ${text.slice(0, 80)}…` : `Note added: ${text}`,
  });
  if (activityError) return { error: activityError.message };

  revalidatePath(`/leads/${leadId}`);
  revalidateLeadPages();
}

export async function deleteNote(
  noteId: string,
  leadId: string,
): Promise<LeadActionResult | void> {
  const { supabase, userId } = await requireUserId();
  if (!userId) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath(`/leads/${leadId}`);
}
