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
  hasExceededLimit: boolean; // Controls access to restricted pages
  variants: any; // Animation variants from parent
}

// Memoized to prevent unnecessary re-renders
const QuickAccessCard = memo(
  ({ hasExceededLimit, variants }: QuickAccessCardProps) => {
    // Next.js navigation hook
    const router = useRouter();

    // Define quick navigation links
    const quickLinks = useMemo(
      () => [
        {
          href: "/agencies",
          title: "View All Agencies",
          description: "Browse complete agency list with cities",
          enabled: true, // Always accessible
        },
        {
          href: "/contacts",
          title: "Manage Contacts",
          description: "Access employee contact directory",
          enabled: !hasExceededLimit, // Disabled when daily limit is exceeded
        },
      ],
      [hasExceededLimit]
    );

    // Navigation handler with access control
    const handleNavigate = useCallback(
      (href: string, enabled: boolean) => {
        // Only allow routing if the button is enabled
        if (enabled) {
          router.push(href);
        }
      },
      [router]
    );

    return (
      // Animated container
      <motion.div variants={variants} initial="hidden" animate="visible">
        {/* Card layout */}
        <Card className="border border-border bg-card text-card-foreground h-full">
          {/* Card header content */}
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Navigate to key sections
            </CardDescription>
          </CardHeader>

          {/* Buttons for navigation */}
          <CardContent className="space-y-4">
            {/* Render each navigation link */}
            {quickLinks.map((link) => (
              <div key={link.title}>
                <Button
                  className={`flex items-center justify-between w-full h-full text-left p-4 border rounded-lg transition-colors ${
                    link.enabled
                      ? "border-border bg-card hover:bg-accent/50 cursor-pointer"
                      : "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed"
                  }`}
                  // Only navigates if enabled
                  onClick={() => handleNavigate(link.href, link.enabled)}
                  disabled={!link.enabled}
                >
                  {/* Text content */}
                  <div>
                    <div className="font-medium text-primary">{link.title}</div>
                    <div className="text-sm text-muted-foreground max-sm:hidden">
                      {link.description}
                    </div>
                  </div>

                  {/* Right arrow icon */}
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

// Helps React DevTools identify the component
QuickAccessCard.displayName = "QuickAccessCard";

export default QuickAccessCard;
