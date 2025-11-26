"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { loadContactsCSVData } from "@/lib/data-loader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { toast } from "sonner";
import { useDailyViews } from "@/hooks/useDailyView";
import { Button } from "@/components/ui/button";

const DAILY_LIMIT = 50;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewStatus, setViewStatus] = useState<ViewStatus>({
    dailyViews: 0,
    remainingViews: DAILY_LIMIT,
    hasExceededLimit: false,
    viewedContacts: [],
  });
  const { incrementDailyViews } = useDailyViews();

  // Memoized load functions to prevent recreations on every render
  const loadViewStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const { data } = await axios.get("/api/view-status");
      console.log("view-status", data);
      setViewStatus(data);
    } catch (err) {
      console.error("Error loading view status:", err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const contactsData = await loadContactsCSVData();

      // Validate data before setting state
      if (!Array.isArray(contactsData)) {
        throw new Error("Invalid data format");
      }

      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    // Load both in parallel for better performance
    await Promise.all([loadViewStatus(), loadContacts()]);
  }, [loadViewStatus, loadContacts]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Memoized handler to prevent recreation
  const handleViewContact = useCallback(
    async (contactId: string) => {
      if (viewStatus.hasExceededLimit) {
        toast.warning("Daily limit reached");
        return;
      }

      if (viewStatus.viewedContacts.includes(contactId)) {
        toast.info("Contact already viewed");
        return;
      }

      try {
        const { data } = await axios.post("/api/track-view", { contactId });
        setViewStatus(data);

        await incrementDailyViews();

        toast.success("Contact details revealed");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setViewStatus(err.response.data);
          toast.error("Daily limit reached");
        } else {
          console.error("Error tracking view:", err);
          toast.error("Failed to view contact");
        }
      }
    },
    [
      viewStatus.hasExceededLimit,
      viewStatus.viewedContacts,
      incrementDailyViews,
    ]
  );

  // Memoize expensive calculations
  const progressPercentage = useMemo(
    () => (viewStatus.dailyViews / DAILY_LIMIT) * 100,
    [viewStatus.dailyViews]
  );

  const isLoading = useMemo(
    () => loading || loadingStatus,
    [loading, loadingStatus]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Employee directory with access controls
          </p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily usage</span>
          <span className="font-medium">
            {viewStatus.remainingViews} remaining
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Alerts */}
      {error && (
        <Alert
          variant="destructive"
          className="border-l-4 border-l-destructive"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {viewStatus.hasExceededLimit && (
        <Alert className="border-l-4 border-l-amber-500 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 flex justify-between items-center">
            <span className="font-medium">
              Daily limit reached. Upgrade your plan for unlimited access.
            </span>
            <Button className="text-amber-900 hover:text-amber-900 bg-amber-100 cursor-pointer">
              Upgrade
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Card className="bg-transparent border-none">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={contacts}
            viewedContacts={viewStatus.viewedContacts}
            onViewContact={handleViewContact}
            hasExceededLimit={viewStatus.hasExceededLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
