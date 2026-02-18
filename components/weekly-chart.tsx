"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";
import type { StudyRecord } from "@/types/study";
import { getSubjectByName } from "@/lib/subjects";

/** 水色系パレット（アプリのメインカラーに合わせる） */
const CHART_COLORS = {
  primary: "#06b6d4",   // cyan-500
  light: "#22d3ee",    // cyan-400
  lighter: "#67e8f9",  // cyan-300
  dark: "#0891b2",     // cyan-600
  muted: "#a5f3fc",    // cyan-200
};

const PIE_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.dark,
  CHART_COLORS.light,
  CHART_COLORS.lighter,
  CHART_COLORS.muted,
  "#0e7490", // cyan-700
];

function formatMinutesForAxis(value: number): string {
  if (value >= 60) return `${Math.round(value / 60)}h`;
  return `${value}分`;
}

function formatMinutesForTooltip(value: number): string {
  if (value < 60) return `${value}分`;
  const h = Math.floor(value / 60);
  const m = Math.round(value % 60);
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

interface WeeklyChartProps {
  records: StudyRecord[];
}

export function WeeklyChart({ records }: WeeklyChartProps) {
  const { barData, pieData } = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    const dayKeys = days.map((d) => d.toISOString().slice(0, 10));

    const barData = days.map((day) => {
      const dateKey = day.toISOString().slice(0, 10);
      const total = records
        .filter((r) => r.startedAt.startsWith(dateKey))
        .reduce((sum, r) => sum + r.durationMinutes, 0);
      return {
        date: dateKey,
        label: format(day, "M/d", { locale: ja }),
        shortLabel: format(day, "E", { locale: ja }).replace("曜日", ""),
        minutes: total,
      };
    });

    const subjectMap = new Map<string, number>();
    records.forEach((r) => {
      const dateKey = r.startedAt.slice(0, 10);
      if (!dayKeys.includes(dateKey)) return;
      subjectMap.set(
        r.subject,
        (subjectMap.get(r.subject) ?? 0) + r.durationMinutes
      );
    });

    const totalMinutes = Array.from(subjectMap.entries()).reduce(
      (sum, [, m]) => sum + m,
      0
    );
    const pieData = Array.from(subjectMap.entries()).map(
      ([name, minutes], i) => {
        const subject = getSubjectByName(name);
        return {
          name,
          value: minutes,
          percentage:
            totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
          color: subject?.color ?? PIE_PALETTE[i % PIE_PALETTE.length],
        };
      }
    );

    return { barData, pieData };
  }, [records]);

  const hasAnyData = barData.some((d) => d.minutes > 0);

  return (
    <div className="min-w-0 space-y-4">
      {/* 週間の学習時間（棒グラフ） */}
      <div className="min-w-0 overflow-hidden rounded-lg border border-cyan-200/60 bg-white/80 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          直近7日間の学習時間
        </h3>
        {hasAnyData ? (
          <div className="h-[220px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
              >
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatMinutesForAxis}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                  labelFormatter={(_, payload) =>
                    payload[0]?.payload?.label ?? ""
                  }
                  formatter={(value: number | undefined) => [
                    value != null ? formatMinutesForTooltip(value) : "0分",
                    "学習時間",
                  ]}
                />
                <Bar
                  dataKey="minutes"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            直近7日間の記録がありません
          </div>
        )}
      </div>

      {/* 科目ごとの割合（円グラフ） */}
      <div className="min-w-0 overflow-hidden rounded-lg border border-cyan-200/60 bg-white/80 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          科目ごとの割合（直近7日間）
        </h3>
        {pieData.length > 0 ? (
          <div className="mx-auto flex w-full max-w-full flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <div className="h-[200px] min-w-0 w-full max-w-[280px] sm:mx-auto sm:h-[180px] sm:max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={70}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                    }}
                    formatter={(value?: number, name?: string, props?: { payload?: { percentage?: number } }) => [
                      `${formatMinutesForTooltip(value ?? 0)} (${props?.payload?.percentage?.toFixed(0) ?? 0}%)`,
                      name ?? "",
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={8}
                    iconType="circle"
                    formatter={(value) => value}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            直近7日間の記録がありません
          </div>
        )}
      </div>
    </div>
  );
}
