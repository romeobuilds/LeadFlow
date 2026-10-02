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
  CATEGORY_MARGIN,
  CHART_HEIGHT,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "@/components/dashboard/chart-theme";
import type { StageBucket } from "@/lib/dashboard-stats";

export function StageChart({ stages }: { stages: StageBucket[] }) {
  const total = stages.reduce((sum, s) => sum + s.count, 0);

  return (
    <ChartPanel label="Leads by stage" aside={`${total} total`}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stages} margin={CATEGORY_MARGIN} barCategoryGap="32%">
            <CartesianGrid {...BASELINE_PROPS} vertical={false} />
            <XAxis dataKey="label" interval={0} {...AXIS_PROPS} />
            <YAxis allowDecimals={false} width={40} {...AXIS_PROPS} />
            <Tooltip
              cursor={BAR_CURSOR}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              formatter={(value) => [value, "Leads"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
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
