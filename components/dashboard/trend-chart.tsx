"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import {
  AXIS_PROPS,
  BASELINE_PROPS,
  CATEGORY_MARGIN,
  CHART_HEIGHT,
  LINE_CURSOR,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "@/components/dashboard/chart-theme";
import type { TrendPoint } from "@/lib/dashboard-stats";

export function TrendChart({ trend }: { trend: TrendPoint[] }) {
  const total = trend.reduce((sum, point) => sum + point.count, 0);

  return (
    <ChartPanel label="New leads — last 30 days" aside={`${total} total`}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={CATEGORY_MARGIN}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.14}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid {...BASELINE_PROPS} vertical={false} />
            <XAxis dataKey="label" minTickGap={32} {...AXIS_PROPS} />
            <YAxis allowDecimals={false} width={40} {...AXIS_PROPS} />
            <Tooltip
              cursor={LINE_CURSOR}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              formatter={(value) => [value, "New leads"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--chart-1)"
              strokeWidth={1.5}
              fill="url(#trendFill)"
              dot={false}
              activeDot={{
                r: 3,
                strokeWidth: 2,
                stroke: "var(--card)",
                fill: "var(--chart-1)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
