import { LeadDialog } from "@/components/leads/lead-dialog";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
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
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Drag cards between stages — changes save automatically.
          </p>
        </div>
        <LeadDialog />
      </div>

      <PipelineBoard initialLeads={leads ?? []} />
    </div>
  );
}
