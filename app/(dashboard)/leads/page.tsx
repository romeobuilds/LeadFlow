import Link from "next/link";
import { InboxIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { LeadRowActions } from "@/components/leads/lead-row-actions";
import { LeadsFilter } from "@/components/leads/leads-filter";
import { PriorityBadge, StageBadge } from "@/components/leads/lead-badges";
import { PageHeader } from "@/components/shared/page-header";
import { formatLeadValue } from "@/lib/stage-meta";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

const HEAD_CLASS = "px-3 text-xs font-medium text-muted-foreground";
const CELL_CLASS = "px-3 py-2";

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

  const rows = leads ?? [];
  const totalValue = rows.reduce((sum, lead) => sum + Number(lead.value), 0);
  const isFiltered = Boolean(q || stage || source);

  return (
    <div className="mx-auto grid max-w-6xl gap-4">
      <PageHeader
        title="Leads"
        description={
          rows.length > 0
            ? `${rows.length} ${rows.length === 1 ? "lead" : "leads"} · ${formatLeadValue(totalValue)} total value`
            : "Search, filter, and manage every lead in one place."
        }
        action={<LeadDialog />}
      />

      <LeadsFilter sources={sources} />

      <Card size="sm">
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="No leads found"
              description={
                isFiltered
                  ? "Try adjusting your search or filters."
                  : "Create your first lead to get started."
              }
              action={isFiltered ? undefined : <LeadDialog />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={HEAD_CLASS}>Name</TableHead>
                  <TableHead className={`${HEAD_CLASS} hidden md:table-cell`}>
                    Company
                  </TableHead>
                  <TableHead className={HEAD_CLASS}>Stage</TableHead>
                  <TableHead className={`${HEAD_CLASS} hidden sm:table-cell`}>
                    Priority
                  </TableHead>
                  <TableHead className={`${HEAD_CLASS} text-right`}>Value</TableHead>
                  <TableHead className={`${HEAD_CLASS} w-10`}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((lead) => (
                  <TableRow key={lead.id} className="group">
                    <TableCell className={CELL_CLASS}>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {lead.name}
                      </Link>
                      {lead.email && (
                        <p className="text-xs text-muted-foreground">
                          {lead.email}
                        </p>
                      )}
                    </TableCell>
                    <TableCell
                      className={`${CELL_CLASS} hidden text-muted-foreground md:table-cell`}
                    >
                      {lead.company ?? "—"}
                    </TableCell>
                    <TableCell className={CELL_CLASS}>
                      <StageBadge stage={lead.stage} />
                    </TableCell>
                    <TableCell className={`${CELL_CLASS} hidden sm:table-cell`}>
                      <PriorityBadge priority={lead.priority} />
                    </TableCell>
                    <TableCell
                      className={`${CELL_CLASS} text-right font-medium tabular-nums`}
                    >
                      {formatLeadValue(lead.value)}
                    </TableCell>
                    <TableCell className={`${CELL_CLASS} pr-2 text-right`}>
                      <LeadRowActions
                        lead={lead}
                        className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      />
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
