import Link from "next/link";
import { InboxIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { LeadRowActions } from "@/components/leads/lead-row-actions";
import { LeadsFilter } from "@/components/leads/leads-filter";
import { PriorityBadge, StageBadge } from "@/components/leads/lead-badges";
import { formatLeadValue } from "@/lib/stage-meta";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

interface LeadsPageProps {
  searchParams: Promise<{ q?: string; stage?: string; source?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { q, stage, source } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("leads")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const term = q?.trim();
  if (term) {
    const like = `%${term.replace(/[%_]/g, "")}%`;
    query = query.or(
      `name.ilike.${like},company.ilike.${like},email.ilike.${like}`,
    );
  }
  if (stage) query = query.eq("stage", stage);
  if (source) query = query.eq("source", source);

  const { data: leads } = await query.returns<Lead[]>();

  // Distinct sources for the filter dropdown.
  const { data: sourceRows } = await supabase
    .from("leads")
    .select("source")
    .eq("user_id", user!.id)
    .not("source", "is", null);
  const sources = Array.from(
    new Set((sourceRows ?? []).map((r) => r.source).filter(Boolean) as string[]),
  ).sort();

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            {leads?.length ?? 0} {leads?.length === 1 ? "lead" : "leads"}
          </p>
        </div>
        <LeadDialog />
      </div>

      <LeadsFilter sources={sources} />

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Leads</CardTitle>
          <CardDescription>All leads matching the current filters.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!leads?.length ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <InboxIcon className="size-8 text-muted-foreground" />
              <p className="font-medium">No leads found</p>
              <p className="text-sm text-muted-foreground">
                {q || stage || source
                  ? "Try adjusting your search or filters."
                  : "Create your first lead to get started."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="hidden sm:table-cell">Priority</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.name}
                      </Link>
                      {lead.email && (
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {lead.company ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StageBadge stage={lead.stage} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <PriorityBadge priority={lead.priority} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatLeadValue(lead.value)}
                    </TableCell>
                    <TableCell>
                      <LeadRowActions lead={lead} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
