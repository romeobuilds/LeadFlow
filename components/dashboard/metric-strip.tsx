export interface Metric {
  label: string;
  value: string;
  hint?: string;
}

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="grid gap-1 bg-background p-3">
          <p className="text-xs text-muted-foreground">{metric.label}</p>
          <p className="font-heading text-2xl leading-none font-semibold tracking-tight tabular-nums">
            {metric.value}
          </p>
          {metric.hint && (
            <p className="text-xs text-muted-foreground/80">{metric.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}
