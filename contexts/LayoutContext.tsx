"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type Collapsible = "offcanvas" | "icon" | "none" | "default";
export type Variant = "inset" | "sidebar" | "floating";
export type LayoutVariant = "default" | "compact" | "full";

// Default values
const DEFAULT_VARIANT = "sidebar" as Variant;
const DEFAULT_COLLAPSIBLE = "icon" as Collapsible;

type LayoutContextType = {
  resetLayout: () => void;
  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;
  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isLoadingSettings: boolean;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: ReactNode;
};

const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [collapsible, setCollapsibleState] = useState<Collapsible>(() => {
    const savedCollapsible = localStorage.getItem("collapsible");
    return savedCollapsible
      ? (savedCollapsible as Collapsible)
      : DEFAULT_COLLAPSIBLE;
  });
  const [variant, setVariantState] = useState<Variant>(DEFAULT_VARIANT);
  const [sidebarOpen, setSidebarOpenState] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const { data } = await axios.get("/api/layout-settings");

      // Apply user's saved settings
      if (data.collapsible) {
        localStorage.setItem("collapsible", data.collapsible);
        setCollapsibleState(data.collapsible);
      }
      if (data.variant) setVariantState(data.variant);
      if (typeof data.sidebarOpen === "boolean")
        setSidebarOpenState(data.sidebarOpen);
    } catch (error) {
      console.error("Error loading layout settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveUserSettings = async (settings: {
    collapsible?: Collapsible;
    variant?: Variant;
    sidebarOpen?: boolean;
  }) => {
    try {
      await axios.post("/api/layout-settings", settings);
    } catch (error) {
      console.error("Error saving layout settings:", error);
    }
  };

  const setCollapsible = (newCollapsible: Collapsible) => {
    localStorage.setItem("collapsible", newCollapsible);
    setCollapsibleState(newCollapsible);
    saveUserSettings({ collapsible: newCollapsible });
  };

  const setVariant = (newVariant: Variant) => {
    setVariantState(newVariant);
    saveUserSettings({ variant: newVariant });
  };

  const setSidebarOpen = (open: boolean) => {
    setSidebarOpenState(open);
    saveUserSettings({ sidebarOpen: open });
  };

  const resetLayout = () => {
    setCollapsibleState(DEFAULT_COLLAPSIBLE);
    setVariantState(DEFAULT_VARIANT);
    setSidebarOpenState(true);
    saveUserSettings({
      collapsible: DEFAULT_COLLAPSIBLE,
      variant: DEFAULT_VARIANT,
      sidebarOpen: true,
    });
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpenState(newState);
    saveUserSettings({ sidebarOpen: newState });
  };

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    isLoadingSettings,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}

export { LayoutProvider };
