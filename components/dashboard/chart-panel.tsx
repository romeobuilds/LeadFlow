import type { ReactNode } from "react";

export function ChartPanel({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </h2>
        {aside && (
          <p className="text-xs text-muted-foreground/80 tabular-nums">{aside}</p>
        )}
      </div>
      {children}
    </section>
  );
}
