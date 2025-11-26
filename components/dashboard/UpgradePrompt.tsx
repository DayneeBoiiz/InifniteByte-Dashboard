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

const UpgradePrompt = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card
        className="border-destructive/20 bg-destructive/5"
        style={{
          borderColor: "var(--destructive)",
          backgroundColor: "var(--destructive) / 0.05",
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: "var(--destructive)" }}>
            Daily Limit Reached
          </CardTitle>
          <CardDescription style={{ color: "var(--destructive)" }}>
            You&apos;ve exceeded your 50 daily contact views. Upgrade to access
            unlimited views.
          </CardDescription>
        </CardHeader>
        <CardContent>
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

UpgradePrompt.displayName = "UpgradePrompt";

export default UpgradePrompt;
