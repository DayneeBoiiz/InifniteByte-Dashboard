"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Memoized component to avoid unnecessary renders
const UpgradePrompt = memo(() => {
  return (
    // Animated container for smooth appearance
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Start invisible and small
      animate={{ opacity: 1, scale: 1 }} // Animate to full size
      transition={{ type: "spring", stiffness: 200 }} // Spring animation
    >
      {/* Alert card shown when user exceeds daily limit */}
      <Card
        className="border-destructive/20 bg-destructive/5"
        style={{
          borderColor: "var(--destructive)",
          backgroundColor: "var(--destructive) / 0.05",
        }}
      >
        {/* Card header */}
        <CardHeader>
          {/* Main warning title */}
          <CardTitle style={{ color: "var(--destructive)" }}>
            Daily Limit Reached
          </CardTitle>

          {/* Description explaining the restriction */}
          <CardDescription style={{ color: "var(--destructive)" }}>
            You&apos;ve exceeded your 50 daily contact views. Upgrade to access
            unlimited views.
          </CardDescription>
        </CardHeader>

        {/* Call-to-action section */}
        <CardContent>
          {/* Upgrade action button */}
          <button
            className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--destructive)" }}
          >
            Upgrade Plan
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Display name helps during debugging
UpgradePrompt.displayName = "UpgradePrompt";

export default UpgradePrompt;
