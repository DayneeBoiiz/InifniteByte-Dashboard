/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  stat: StatData;
  index: number;
  hasExceededLimit: boolean;
  variants: any;
}

const StatCard = memo(
  ({ stat, index, hasExceededLimit, variants }: StatCardProps) => {
    return (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
      >
        <Card className="border border-border bg-card text-card-foreground overflow-hidden h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              {stat.title}
            </CardTitle>
            <div>
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              style={{
                color:
                  stat.title === "Today's Views" && hasExceededLimit
                    ? "var(--destructive)"
                    : "var(--foreground)",
              }}
            >
              {stat.value}
            </motion.div>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;
