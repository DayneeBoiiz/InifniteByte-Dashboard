/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface DashboardHeaderProps {
  variants: any; // Animation settings passed from parent
}

// Memoized component to prevent unnecessary re-renders
const DashboardHeader = memo(({ variants }: DashboardHeaderProps) => {
  return (
    // Animated container using Framer Motion
    <motion.div variants={variants}>
      {/* Main heading */}
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Dashboard
      </h1>

      {/* Subheading text */}
      <p style={{ color: "var(--muted-foreground)" }}>
        Welcome to your agency management dashboard
      </p>
    </motion.div>
  );
});

// Helps with debugging and React DevTools profiling
DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
