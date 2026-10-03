import Link from "next/link";
import { KanbanSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <KanbanSquareIcon className="size-3.5" />
      </span>
      <span className="font-heading text-sm font-semibold tracking-tight">
        LeadFlow
      </span>
    </Link>
  );
}