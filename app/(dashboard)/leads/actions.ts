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
