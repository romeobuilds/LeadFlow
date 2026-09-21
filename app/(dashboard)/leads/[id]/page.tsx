import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { DeleteLeadButton } from "@/components/leads/delete-lead-button";
import { PriorityBadge, StageBadge } from "@/components/leads/lead-badges";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { NoteCard } from "@/components/leads/note-card";
import { NoteForm } from "@/components/leads/note-form";
import { formatDate } from "@/lib/format-date";
import { formatLeadValue } from "@/lib/stage-meta";
import { createClient } from "@/lib/supabase/server";
import type { Activity, Lead, Note } from "@/lib/types";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: lead }, { data: notes }, { data: activities }] =
    await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .eq("user_id", user!.id)
        .single<Lead>(),
      supabase
        .from("notes")
        .select("*")
        .eq("lead_id", id)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .returns<Note[]>(),
      supabase
        .from("activities")
        .select("*")
        .eq("lead_id", id)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50)
        .returns<Activity[]>(),
    ]);

  if (!lead) notFound();

  const details: Array<{ label: string; value: string }> = [
    { label: "Email", value: lead.email ?? "—" },
    { label: "Phone", value: lead.phone ?? "—" },
    { label: "Company", value: lead.company ?? "—" },
    { label: "Source", value: lead.source ?? "—" },
    { label: "Expected close", value: formatDate(lead.expected_close) },
    { label: "Created", value: formatDate(lead.created_at) },
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <Link
        href="/leads"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to leads
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1.5">
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <StageBadge stage={lead.stage} />
                <PriorityBadge priority={lead.priority} />
                <span className="text-base font-semibold text-foreground">
                  {formatLeadValue(lead.value)}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <LeadDialog
                lead={lead}
                trigger={
                  <Button variant="outline" size="sm">
                    <PencilIcon className="size-4" />
                    Edit
                  </Button>
                }
              />
              <DeleteLeadButton leadId={lead.id} leadName={lead.name} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {d.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">
              Notes ({notes?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <NoteForm leadId={lead.id} />
            <Separator />
            {!notes?.length ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No notes yet. Add the first one above.
              </p>
            ) : (
              notes.map((note) => <NoteCard key={note.id} note={note} />)
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Activity</CardTitle>
            <CardDescription>
              Created, stage moves, and notes — logged automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
