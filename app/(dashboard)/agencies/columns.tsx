/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/contacts/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, EyeOff, Phone } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: "name",
    header: "Agency Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.getValue("type"),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => row.getValue("state"),
  },
  {
    accessorKey: "population",
    header: "Population",
    cell: ({ row }) => row.getValue("population"),
  },
  {
    accessorKey: "county",
    header: "County",
    cell: ({ row }) => row.getValue("county"),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      return website ? (
        <Link
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm"
        >
          Visit Site
          <ExternalLink className="size-3" />
        </Link>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;

      return phone ? (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-3 text-muted-foreground" />
          {phone}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
