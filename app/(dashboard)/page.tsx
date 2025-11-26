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

// Animation configuration for the main container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Adds delay between animations of child components
    },
  },
};

// Animation configuration for each child component
const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Start slightly below and invisible
  visible: {
    opacity: 1,
    y: 0, // Move into place
  },
};

export default function DashboardPage() {
  // Get user view statistics from custom hook
  const { dailyViews, weekViews, hasExceededLimit } = useDailyViews();

  // Prepare and validate data only when dependencies change
  const processedData = useMemo(() => {
    // Ensure weekly data is always an array
    const safeWeekViews = Array.isArray(weekViews) ? weekViews : [];

    // Return cleaned and safe object
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
      {/* Dashboard header section */}
      <DashboardHeader variants={itemVariants} />

      {/* Statistics display cards */}
      <StatsGrid
        dailyViews={processedData.dailyViews}
        hasExceededLimit={processedData.hasExceededLimit}
        variants={itemVariants}
      />

      {/* Display upgrade message when limit is exceeded */}
      {processedData.hasExceededLimit && <UpgradePrompt />}

      {/* Action and analytics section */}
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
