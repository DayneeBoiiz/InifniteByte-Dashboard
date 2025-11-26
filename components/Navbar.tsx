// components/Navbar.tsx
"use client";

import { memo, useMemo } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import UISettings from "./UISettings";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";

const ROUTES: { [key: string]: string } = {
  "/": "Dashboard",
  "/agencies": "Agencies",
  "/contacts": "Contacts",
  "/settings": "Settings",
  "/help": "Help",
};

function getPageTitle(pathname: string): string {
  return ROUTES[pathname] || "Dashboard";
}

export const Navbar = memo(() => {
  const pathname = usePathname();

  // Memoize page title calculation
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  // Memoize whether to show separator
  const isNotHomePage = useMemo(() => pathname !== "/", [pathname]);

  return (
    <header className="flex h-16 items-center gap-4 bg-background px-6">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="-ml-2 bg-sidebar cursor-pointer" />

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0 border-l border-l-sidebar-border px-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {isNotHomePage && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UISettings />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
});

Navbar.displayName = "Navbar";
