/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, User } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "first_name",
    header: "Contact",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">
              {row.original.first_name} {row.original.last_name}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.title}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {row.getValue("department")}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="size-3 text-muted-foreground" />
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-3 text-muted-foreground" />
          {row.getValue("phone")}
        </div>
      );
    },
  },
];
