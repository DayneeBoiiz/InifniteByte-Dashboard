/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/components/AnalyticsCard.tsx
"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsCardProps {
  dailyViews: number;
  weekViews: WeekView[];
  hasExceededLimit: boolean;
  variants: any;
}

const DAILY_LIMIT = 50;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AnalyticsCard = memo(
  ({
    dailyViews,
    weekViews,
    hasExceededLimit,
    variants,
  }: AnalyticsCardProps) => {
    // Memoize chart data processing
    const chartData = useMemo(() => {
      return DAYS.map((day) => ({
        day,
        views: weekViews.find((w) => w?.day === day)?.views || 0,
      }));
    }, [weekViews]);

    // Memoize progress calculations
    const progressData = useMemo(() => {
      const percentage = Math.min((dailyViews / DAILY_LIMIT) * 100, 100);
      const remaining = DAILY_LIMIT - dailyViews;
      const status = hasExceededLimit ? "Limit Exceeded" : "Within Limit";

      return { percentage, remaining, status };
    }, [dailyViews, hasExceededLimit]);

    return (
      <motion.div variants={variants} initial="hidden" animate="visible">
        <Card className="border border-border bg-card text-card-foreground h-full">
          <CardHeader>
            <CardTitle>Weekly View Analytics</CardTitle>
            <CardDescription style={{ color: "var(--muted-foreground)" }}>
              Your contact views this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chart */}
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    style={{ opacity: 0.3, stroke: "var(--border)" }}
                  />
                  <XAxis
                    dataKey="day"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    style={{ fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, DAILY_LIMIT]}
                    style={{ fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--card-foreground)",
                    }}
                    itemStyle={{ color: "var(--card-foreground)" }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                  <Bar
                    dataKey="views"
                    radius={[2, 2, 0, 0]}
                    style={{
                      fill: hasExceededLimit
                        ? "var(--destructive)"
                        : "var(--chart-3)",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: "var(--muted-foreground)" }}>
                  Daily Progress
                </span>
                <span
                  className={`font-medium ${
                    hasExceededLimit ? "text-destructive" : "text-chart-3"
                  }`}
                >
                  {progressData.status}
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: hasExceededLimit
                      ? "var(--destructive)"
                      : "var(--chart-3)",
                    width: `${progressData.percentage}%`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div
                className="flex justify-between items-center text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span>{dailyViews} views today</span>
                <span>{progressData.remaining} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AnalyticsCard.displayName = "AnalyticsCard";

export default AnalyticsCard;
