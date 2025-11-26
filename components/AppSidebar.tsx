// components/AppSidebar.tsx
"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLayout } from "@/contexts/LayoutContext";

const NAVIGATION = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    description: "Overview and analytics",
  },
  {
    name: "Agencies",
    href: "/agencies",
    icon: Building2,
    description: "Manage agencies",
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
    description: "Employee directory",
  },
] as const;

export const AppSidebar = memo(() => {
  const pathname = usePathname();
  const { variant, collapsible } = useLayout();

  // Memoize navigation items with active states
  const navigationItems = useMemo(() => {
    return NAVIGATION.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }));
  }, [pathname]);

  return (
    <Sidebar
      collapsible={collapsible}
      className="bg-background"
      variant={variant}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-2 bg-background h-16 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sidebar-foreground text-lg truncate">
              AgencyDashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="bg-background">
        <SidebarMenu className="p-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.name}
              >
                <Link href={item.href} prefetch={true}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";
