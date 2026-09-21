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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TrendPoint } from "@/lib/dashboard-stats";

export function TrendChart({ trend }: { trend: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">New leads — last 30 days</CardTitle>
        <CardDescription>Daily intake across all sources.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                minTickGap={32}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ stroke: "var(--muted-foreground)" }}
                formatter={(value) => [value, "New leads"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#trendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
