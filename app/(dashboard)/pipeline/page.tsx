import { LeadDialog } from "@/components/leads/lead-dialog";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export default async function PipelinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<Lead[]>();

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Pipeline"
        description="Drag cards between stages — changes save automatically."
        action={<LeadDialog />}
      />

      <PipelineBoard initialLeads={leads ?? []} />
    </div>
  );
}
