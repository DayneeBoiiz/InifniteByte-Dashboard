// app/dashboard/page.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useDailyViews } from "@/hooks/useDailyView";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function DashboardPage() {
  const { dailyViews, weekViews, hasExceededLimit } = useDailyViews();

  // Memoize processed data
  const processedData = useMemo(() => {
    const safeWeekViews = Array.isArray(weekViews) ? weekViews : [];

    return {
      dailyViews,
      hasExceededLimit,
      weekViews: safeWeekViews,
    };
  }, [dailyViews, weekViews, hasExceededLimit]);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <DashboardHeader variants={itemVariants} />

      {/* Stats Grid */}
      <StatsGrid
        dailyViews={processedData.dailyViews}
        hasExceededLimit={processedData.hasExceededLimit}
        variants={itemVariants}
      />

      {/* Upgrade Prompt */}
      {processedData.hasExceededLimit && <UpgradePrompt />}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickAccessCard
          hasExceededLimit={processedData.hasExceededLimit}
          variants={itemVariants}
        />
        <AnalyticsCard
          dailyViews={processedData.dailyViews}
          weekViews={processedData.weekViews}
          hasExceededLimit={processedData.hasExceededLimit}
          variants={itemVariants}
        />
      </div>
    </motion.div>
  );
}
