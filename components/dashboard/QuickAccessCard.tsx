/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface QuickAccessCardProps {
  hasExceededLimit: boolean;
  variants: any;
}

const QuickAccessCard = memo(
  ({ hasExceededLimit, variants }: QuickAccessCardProps) => {
    const router = useRouter();

    // Memoize quick links configuration
    const quickLinks = useMemo(
      () => [
        {
          href: "/agencies",
          title: "View All Agencies",
          description: "Browse complete agency list with cities",
          enabled: true,
        },
        {
          href: "/contacts",
          title: "Manage Contacts",
          description: "Access employee contact directory",
          enabled: !hasExceededLimit,
        },
      ],
      [hasExceededLimit]
    );

    // Memoize navigation handler
    const handleNavigate = useCallback(
      (href: string, enabled: boolean) => {
        if (enabled) {
          router.push(href);
        }
      },
      [router]
    );

    return (
      <motion.div variants={variants} initial="hidden" animate="visible">
        <Card className="border border-border bg-card text-card-foreground h-full">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription style={{ color: "var(--muted-foreground)" }}>
              Navigate to key sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickLinks.map((link) => (
              <div key={link.title}>
                <Button
                  className={`flex items-center justify-between w-full h-full text-left p-4 border rounded-lg transition-colors ${
                    link.enabled
                      ? "border-border bg-card hover:bg-accent/50 cursor-pointer"
                      : "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed"
                  }`}
                  onClick={() => handleNavigate(link.href, link.enabled)}
                  disabled={!link.enabled}
                >
                  <div>
                    <div className="font-medium text-primary">{link.title}</div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {link.description}
                    </div>
                  </div>
                  <div>
                    <ArrowRight
                      className="h-4 w-4"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </div>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

QuickAccessCard.displayName = "QuickAccessCard";

export default QuickAccessCard;
