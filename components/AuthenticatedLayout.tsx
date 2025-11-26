"use client";

import { useAuth } from "@clerk/nextjs";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import MinimalLoading from "./MinimalLoading";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading state while auth is loading or component is mounting
  if (!isLoaded) {
    return <MinimalLoading />;
  }

  // If signed in, show authenticated layout with sidebar and navbar
  if (isSignedIn) {
    return (
      <>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-6 bg-muted/10">{children}</main>
        </SidebarInset>
      </>
    );
  }

  // If signed out, show minimal layout
  return <main className="flex-1 bg-muted/10">{children}</main>;
}
