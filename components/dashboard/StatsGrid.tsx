"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { Building2, Users, Eye, Calendar } from "lucide-react";
import StatCard from "./StatCard";
import { loadAgenciesCSVData, loadContactsCSVData } from "@/lib/data-loader";

const StatsGrid = memo(
  ({ dailyViews, hasExceededLimit, variants }: StatsGridProps) => {
    const [totalAgencies, setTotalAgencies] = useState<number | null>(null);
    const [totalContacts, setTotalContacts] = useState<number | null>(null);

    useEffect(() => {
      loadAgenciesCSVData().then((data) => setTotalAgencies(data.length));
      loadContactsCSVData().then((data) => setTotalContacts(data.length));
    }, []);

    // Memoize stats configuration
    const stats = useMemo(
      () => [
        {
          icon: Building2,
          title: "Total Agencies",
          value: totalAgencies?.toString() || "0",
          description: "Agencies in database",
          color: "var(--chart-1)",
        },
        {
          icon: Users,
          title: "Total Contacts",
          value: totalContacts?.toString() || "0",
          description: "Employee contacts available",
          color: "var(--chart-2)",
        },
        {
          icon: Eye,
          title: "Today's Views",
          value: `${dailyViews}/50`,
          description: hasExceededLimit
            ? "Limit exceeded"
            : "Contact views remaining",
          color: hasExceededLimit ? "var(--destructive)" : "var(--chart-3)",
        },
        {
          icon: Calendar,
          title: "Daily Reset",
          value: "Midnight",
          description: "Views reset daily",
          color: "var(--chart-4)",
        },
      ],
      [dailyViews, hasExceededLimit, totalAgencies, totalContacts]
    );

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            stat={stat}
            index={index}
            hasExceededLimit={hasExceededLimit}
            variants={variants}
          />
        ))}
      </div>
    );
  }
);

StatsGrid.displayName = "StatsGrid";

export default StatsGrid;
