"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import {
  AXIS_PROPS,
  BAR_CURSOR,
  BASELINE_PROPS,
  CHART_HEIGHT,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "@/components/dashboard/chart-theme";
import { formatLeadValue } from "@/lib/stage-meta";
import type { StageBucket } from "@/lib/dashboard-stats";

export function ValueChart({ stages }: { stages: StageBucket[] }) {
  const total = stages.reduce((sum, s) => sum + s.value, 0);

  return (
    <ChartPanel
      label="Pipeline value by stage"
      aside={formatLeadValue(total)}
    >
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stages}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            barCategoryGap="32%"
          >
            <CartesianGrid {...BASELINE_PROPS} horizontal={false} />
            <XAxis
              type="number"
              {...AXIS_PROPS}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
              }
            />
            <YAxis
              type="category"
              dataKey="label"
              {...AXIS_PROPS}
              width={68}
            />
            <Tooltip
              cursor={BAR_CURSOR}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              formatter={(value) => [formatLeadValue(Number(value)), "Value"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {stages.map((s) => (
                <Cell key={s.stage} fill={s.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
