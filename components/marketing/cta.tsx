import { ArrowRightIcon } from "lucide-react";
import { ButtonLink } from "@/components/marketing/button-link";

export function Cta() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid justify-items-center gap-5 rounded-2xl bg-muted/60 px-6 py-14 text-center ring-1 ring-foreground/10">
          <h2 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-balance">
            Stop losing leads between the inbox and the calendar.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Create your workspace, add your first lead, and drag it to won. That is
            the whole setup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ButtonLink size="lg" href="/signup">
              Create your free account
              <ArrowRightIcon data-icon="inline-end" />
            </ButtonLink>
            <ButtonLink size="lg" variant="outline" href="/login">
              Log in
            </ButtonLink>
          </div>
          <p className="text-xs text-muted-foreground">
            Your leads stay private to your account.
          </p>
        </div>
      </div>
    </section>
  );
}