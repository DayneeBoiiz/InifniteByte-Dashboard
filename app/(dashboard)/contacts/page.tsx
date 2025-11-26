/* eslint-disable react-hooks/exhaustive-deps */
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
// Maximum number of contacts a user can view per day

export default function ContactsPage() {
  // Stores all contact records
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Loading state for contact data
  const [loading, setLoading] = useState(true);

  // Loading state for view-tracking data
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Stores error message if something fails
  const [error, setError] = useState<string | null>(null);

  // Tracks daily view usage and limits
  const [viewStatus, setViewStatus] = useState<ViewStatus>({
    dailyViews: 0,
    remainingViews: DAILY_LIMIT,
    hasExceededLimit: false,
    viewedContacts: [],
  });

  // Hook used to update daily view count
  const { incrementDailyViews } = useDailyViews();

  // -------- LOAD VIEW LIMIT DATA --------
  const loadViewStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const { data } = await axios.get("/api/view-status");

      // Store view limits and usage
      setViewStatus(data);
    } catch (err) {
      void err;
      toast.error("Failed to load view status");
      // console.error("Error loading view status:", err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  // -------- LOAD CONTACT DATA --------
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const contactsData = await loadContactsCSVData();

      // Ensure returned data is valid
      if (!Array.isArray(contactsData)) {
        throw new Error("Invalid data format");
      }

      // Save contact data
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      void err;
      // console.error("Error loading contacts:", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  // -------- LOAD BOTH DATA SOURCES AT ONCE --------
  const loadInitialData = useCallback(async () => {
    // Improves performance by loading both in parallel
    await Promise.all([loadViewStatus(), loadContacts()]);
  }, []);

  // Run once when page loads
  useEffect(() => {
    loadInitialData();
  }, []);

  // -------- HANDLE CONTACT VIEW --------
  const handleViewContact = useCallback(
    async (contactId: string) => {
      // Block user if daily limit is reached
      if (viewStatus.hasExceededLimit) {
        toast.warning("Daily limit reached");
        return;
      }

      // Prevent duplicate views
      if (viewStatus.viewedContacts.includes(contactId)) {
        toast.info("Contact already viewed");
        return;
      }

      try {
        // Track view on the server
        const { data } = await axios.post("/api/track-view", { contactId });

        // Update view tracking state
        setViewStatus(data);

        // Update global daily view counter
        await incrementDailyViews();

        toast.success("Contact details revealed");
      } catch (err) {
        // If limit reached on server
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setViewStatus(err.response.data);
          toast.error("Daily limit reached");
        } else {
          void err;
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

  // -------- PROGRESS BAR CALCULATION --------
  const progressPercentage = useMemo(
    () => (viewStatus.dailyViews / DAILY_LIMIT) * 100,
    [viewStatus.dailyViews]
  );

  // -------- COMBINED LOADING STATE --------
  const isLoading = useMemo(
    () => loading || loadingStatus,
    [loading, loadingStatus]
  );

  // -------- LOADING SCREEN --------
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

  // -------- MAIN UI --------
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

      {/* Usage Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily usage</span>
          <span className="font-medium">
            {viewStatus.remainingViews} remaining
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="border-l-4 border-l-destructive"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Daily Limit Alert */}
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

      {/* Contacts Table */}
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
