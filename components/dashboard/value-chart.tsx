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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatLeadValue } from "@/lib/stage-meta";
import type { StageBucket } from "@/lib/dashboard-stats";

export function ValueChart({ stages }: { stages: StageBucket[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pipeline value by stage</CardTitle>
        <CardDescription>Where the money is sitting.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stages}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
                }
              />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={80} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(value) => [
                  formatLeadValue(Number(value)),
                  "Value",
                ]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {stages.map((s) => (
                  <Cell key={s.stage} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
