import { ArrowRightIcon } from "lucide-react";
import { ButtonLink } from "@/components/marketing/button-link";
import { PipelinePreview } from "@/components/marketing/pipeline-preview";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-56 -z-10 h-[28rem] bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-muted),transparent)]"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-20">
        <div className="grid justify-items-center gap-5 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground ring-1 ring-foreground/10">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Lead management for agencies &amp; freelancers
          </p>
          <h1 className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Every lead, every stage, one pipeline.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">
            LeadFlow replaces the spreadsheet and the follow-up guilt with a single
            board. Capture leads, drag them from new to won, and always know which
            deals are worth chasing this week.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ButtonLink size="lg" href="/signup">
              Start for free
              <ArrowRightIcon data-icon="inline-end" />
            </ButtonLink>
            <ButtonLink size="lg" variant="outline" href="/login">
              Log in
            </ButtonLink>
          </div>
          <p className="text-xs text-muted-foreground">
            Set up in under a minute · No credit card required
          </p>
        </div>
        <PipelinePreview />
      </div>
    </section>
  );
}