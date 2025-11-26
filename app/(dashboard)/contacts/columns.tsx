/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/contacts/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("first_name") : "•••••";
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("last_name") : "•••••";
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("email") : "•••••••@••••••.com";
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("phone") : "•••-•••-••••";
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("title") : "•••••••";
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row, table }) => {
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        row.original.id
      );
      return isViewed ? row.getValue("department") : "•••••••";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const contact = row.original;
      const isViewed = (table.options.meta as any)?.viewedContacts?.includes(
        contact.id
      );
      const handleView = (table.options.meta as any)?.handleViewContact;
      const hasExceededLimit = (table.options.meta as any)?.hasExceededLimit;

      return (
        <Button
          variant={isViewed ? "outline" : "default"}
          size="sm"
          onClick={() => handleView(contact.id)}
          disabled={isViewed || hasExceededLimit}
        >
          {isViewed ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Viewed
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              View Contact
            </>
          )}
        </Button>
      );
    },
  },
];
