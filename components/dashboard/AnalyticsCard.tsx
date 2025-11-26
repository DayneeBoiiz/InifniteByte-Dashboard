/* eslint-disable @typescript-eslint/no-explicit-any */
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
  dailyViews: number; // Number of contact views today
  weekViews: WeekView[]; // Views data for the week
  hasExceededLimit: boolean; // Whether daily limit is reached
  variants: any; // Animation variants from parent
}

const DAILY_LIMIT = 50; // Maximum daily contact views
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Weekdays

// Memoized component to avoid unnecessary re-renders
const AnalyticsCard = memo(
  ({
    dailyViews,
    weekViews,
    hasExceededLimit,
    variants,
  }: AnalyticsCardProps) => {
    // Prepare chart data for Recharts
    const chartData = useMemo(() => {
      return DAYS.map((day) => ({
        day,
        views: weekViews.find((w) => w?.day === day)?.views || 0, // Default 0 if missing
      }));
    }, [weekViews]);

    // Calculate progress status for daily views
    const progressData = useMemo(() => {
      const percentage = Math.min((dailyViews / DAILY_LIMIT) * 100, 100); // Progress bar width
      const remaining = DAILY_LIMIT - dailyViews; // Remaining views
      const status = hasExceededLimit ? "Limit Exceeded" : "Within Limit";

      return { percentage, remaining, status };
    }, [dailyViews, hasExceededLimit]);

    return (
      // Animated container
      <motion.div variants={variants} initial="hidden" animate="visible">
        {/* Main analytics card */}
        <Card className="border border-border bg-card text-card-foreground h-full">
          {/* Card header with title and description */}
          <CardHeader>
            <CardTitle>Weekly View Analytics</CardTitle>
            <CardDescription style={{ color: "var(--muted-foreground)" }}>
              Your contact views this week
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Weekly bar chart */}
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  {/* Grid lines */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    style={{ opacity: 0.3, stroke: "var(--border)" }}
                  />

                  {/* X axis with weekdays */}
                  <XAxis
                    dataKey="day"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    style={{ fill: "var(--muted-foreground)" }}
                  />

                  {/* Y axis with domain up to daily limit */}
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, DAILY_LIMIT]}
                    style={{ fill: "var(--muted-foreground)" }}
                  />

                  {/* Tooltip on hover */}
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

                  {/* Bar representing views */}
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

            {/* Daily progress section */}
            <div className="space-y-2">
              {/* Progress label */}
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

              {/* Progress bar */}
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

              {/* Daily views count */}
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

// Helps React DevTools identify the component
AnalyticsCard.displayName = "AnalyticsCard";

export default AnalyticsCard;
// Export component for dashboard usage
