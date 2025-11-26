import React from "react";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Settings, RotateCcw } from "lucide-react";
import {
  ThemeToggleCard,
  SidebarOptionCard,
  LayoutOptionCard,
} from "./UISettingsCards";
import { useLayout } from "@/contexts/LayoutContext";
import { Separator } from "./ui/separator";

const UISettings = () => {
  const { resetLayout } = useLayout();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 hover:bg-accent/50 transition-colors max-sm:hidden"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[380px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 text-left border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold tracking-tight">
                  UI Settings
                </SheetTitle>
                <SheetDescription className="text-sm">
                  Customize the appearance and layout
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Theme Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium tracking-tight">Theme</h3>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <ThemeToggleCard
                  label="System"
                  value="system"
                  description="Auto"
                />
                <ThemeToggleCard
                  label="Light"
                  value="light"
                  description="Light mode"
                />
                <ThemeToggleCard
                  label="Dark"
                  value="dark"
                  description="Dark mode"
                />
              </div>
            </div>

            <Separator />

            {/* Sidebar Variant Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium tracking-tight">
                  Sidebar Style
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose how the sidebar appears
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <SidebarOptionCard
                  label="Inset"
                  value="inset"
                  description="Integrated"
                />
                <SidebarOptionCard
                  label="Floating"
                  value="floating"
                  description="Elevated"
                />
                <SidebarOptionCard
                  label="Standard"
                  value="sidebar"
                  description="Classic"
                />
              </div>
            </div>

            <Separator />

            {/* Layout Type Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium tracking-tight">
                  Layout Mode
                </h3>
                <p className="text-xs text-muted-foreground">
                  Control sidebar behavior
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <LayoutOptionCard
                  label="Default"
                  value="default"
                  description="Standard"
                />
                <LayoutOptionCard
                  label="Compact"
                  value="icon"
                  description="Icons only"
                />
                <LayoutOptionCard
                  label="Hidden"
                  value="offcanvas"
                  description="Off-screen"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-muted/20">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full cursor-pointer gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={resetLayout}
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UISettings;
