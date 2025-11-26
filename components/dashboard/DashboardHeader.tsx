/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface DashboardHeaderProps {
  variants: any;
}

const DashboardHeader = memo(({ variants }: DashboardHeaderProps) => {
  return (
    <motion.div variants={variants}>
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Dashboard
      </h1>
      <p style={{ color: "var(--muted-foreground)" }}>
        Welcome to your agency management dashboard
      </p>
    </motion.div>
  );
});

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
