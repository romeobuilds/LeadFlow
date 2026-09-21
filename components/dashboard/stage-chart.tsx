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
import type { StageBucket } from "@/lib/dashboard-stats";

export function StageChart({ stages }: { stages: StageBucket[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leads by stage</CardTitle>
        <CardDescription>Where every lead sits right now.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stages} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(value) => [value, "Leads"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
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
