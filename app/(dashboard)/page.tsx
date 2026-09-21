import Link from "next/link";
import { ArrowRightIcon, KanbanIcon, UsersIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: leadCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user?.email} · {leadCount ?? 0}{" "}
          {leadCount === 1 ? "lead" : "leads"} tracked
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KanbanIcon className="size-5" />
              Pipeline
            </CardTitle>
            <CardDescription>
              Drag leads through New → Contacted → Qualified → Proposal →
              Won/Lost.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/pipeline"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Open pipeline <ArrowRightIcon className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UsersIcon className="size-5" />
              Leads
            </CardTitle>
            <CardDescription>
              Search, filter, and manage every lead profile in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/leads"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Browse leads <ArrowRightIcon className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
