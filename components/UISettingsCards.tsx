/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "next-themes";
import { useLayout } from "@/contexts/LayoutContext";
import { Badge } from "./ui/badge";
import { IconLayoutCompact } from "@/assets/custom/IconLayoutCompact";
import { IconLayoutDefault } from "@/assets/custom/IconLayoutDefault";
import { IconLayoutFull } from "@/assets/custom/IconLayoutFull";
import { IconSidebarFloating } from "@/assets/custom/IconSidebarFloating";
import { IconSidebarInset } from "@/assets/custom/IconSidebarInset";
import { IconSidebarSidebar } from "@/assets/custom/IconSidebarSidebar";
import { IconThemeDark } from "@/assets/custom/IconThemeDark";
import { IconThemeLight } from "@/assets/custom/IconThemeLight";
import { IconThemeSystem } from "@/assets/custom/IconThemeSystem";
import { useSidebar } from "./ui/sidebar";

export function ThemeToggleCard({ label, value }: any) {
  const { setTheme, theme } = useTheme();
  const Icon =
    value === "light"
      ? IconThemeLight
      : value === "dark"
      ? IconThemeDark
      : IconThemeSystem;

  return (
    <>
      <div className="flex flex-col justify-center gap-1">
        <div
          className="relative rounded-lg border bg-background hover:bg-accent transition"
          onClick={() => setTheme(value)}
        >
          <div className="rounded-md bg-muted w-full h-full">
            <Icon className="w-full h-full" />
          </div>
          {theme === value && (
            <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5"></Badge>
          )}
        </div>
        <span className="text-xs self-center">{label}</span>
      </div>
    </>
  );
}

export function SidebarOptionCard({ label, value }: any) {
  const { variant, setVariant } = useLayout();
  const Icon =
    value === "inset"
      ? IconSidebarInset
      : value === "floating"
      ? IconSidebarFloating
      : IconSidebarSidebar;

  return (
    <div className="flex flex-col justify-center gap-1">
      <div
        className="relative rounded-lg border bg-background hover:bg-accent transition"
        onClick={() => setVariant(value)}
      >
        <div className="rounded-md bg-muted w-full h-full">
          <Icon className="w-full h-full" />
        </div>
        {variant === value && (
          <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5"></Badge>
        )}
      </div>
      <span className="text-xs self-center">{label}</span>
    </div>
  );
}

export function LayoutOptionCard({ label, value }: any) {
  const { collapsible, setCollapsible } = useLayout();
  const { setOpen } = useSidebar();
  const Icon =
    value === "default"
      ? IconLayoutDefault
      : value === "icon"
      ? IconLayoutCompact
      : IconLayoutFull;

  return (
    <div className="flex flex-col justify-center gap-1">
      <div
        className="relative rounded-lg border bg-background hover:bg-accent transition"
        onClick={() => {
          if (value === "default") {
            setOpen(true);
            setCollapsible("default");
            return;
          }
          setOpen(false);
          setCollapsible(value);
        }}
      >
        <div className="rounded-md bg-muted w-full h-full">
          <Icon className="w-full h-full" />
        </div>
        {collapsible === value && (
          <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5"></Badge>
        )}
      </div>
      <span className="text-xs self-center">{label}</span>
    </div>
  );
}
